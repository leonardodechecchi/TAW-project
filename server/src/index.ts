import http from 'http';
import express, { Express } from 'express';
import io from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import multer from 'multer';
import path from 'path';
import { registerRoutes } from './utils/register-routes';
import { ChatJoinedListener } from './socket/listeners/ChatJoined';
import { ChatLeftListener } from './socket/listeners/ChatLeft';
import { ServerLeft } from './socket/listeners/ServerLeft';
import { MatchJoinedListener } from './socket/listeners/MatchJoined';
import { MatchLeftListener } from './socket/listeners/MatchLeft';
import { MatchRequestAcceptedListener } from './socket/listeners/MatchRequestAccepted';

dotenv.config();
colors.enable();

// Retrieve http server port number
const port: string | undefined = process.env.PORT;

declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}

// Setup db connection and establish connection
require('./config/db');

// Setup passport strategy
require('./config/passport');

// Create express app
const app: Express = express();

// Get passport middleware
export const auth = passport.authenticate('jwt', { session: false });

// Register useful middleware
app.use(express.json());
app.use(
  morgan(
    `[${colors.blue(':date')}] :method :url ${colors.yellow(':status')} - ${colors.red(
      ':response-time ms'
    )}`
  )
);
app.use(cors());
app.use('/images', express.static(path.join(__dirname, '../images')));

// Picture upload config
const diskStorage: multer.Options['storage'] = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    const mimeType = file.mimetype.split('/');
    const fileType = mimeType[1];
    const fileName = file.originalname + '.' + fileType;
    cb(null, fileName);
  },
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single('image');

// Register routes
registerRoutes(app);

// Http server creation
export const httpServer: http.Server = http.createServer(app);

// Socket server creation
export const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:4200` },
});

// Socket server configuration
ioServer.use((client, next) => {
  const userId = client.handshake.auth.userId;
  client.userId = userId;

  client.join(userId);
  console.log(`${client.userId} connected!`);

  next();
});

// Socket server events
ioServer.on('connection', (client: io.Socket) => {
  /**
   * OK
   */
  const serverLeft = new ServerLeft(client);
  serverLeft.listen();

  /**
   * OK
   */
  const chatJoined = new ChatJoinedListener(client);
  chatJoined.listen();

  /**
   * OK
   */
  const chatLeft = new ChatLeftListener(client);
  chatLeft.listen();

  /**
   * TODO test
   */
  const matchRequestAccepted = new MatchRequestAcceptedListener(ioServer, client);
  matchRequestAccepted.listen();

  /**
   * TODO test
   */
  const matchJoined = new MatchJoinedListener(client);
  matchJoined.listen();

  /**
   * TODO test
   */
  const matchLeft = new MatchLeftListener(ioServer, client);
  matchLeft.listen();
});

// Finally start http server
httpServer.listen(port, () => {
  console.log(`[${colors.blue('server')}]: Server is running at http://localhost:${port}`);
});
