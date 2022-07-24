import http from 'http';
import express, { Express } from 'express';
import io from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import { registerRoutes } from './utils/register-routes';
import { ChatJoinedListener } from './socket/listeners/ChatJoined';
import { ServerJoined } from './socket/listeners/ServerJoined';
import { ChatLeftListener } from './socket/listeners/ChatLeft';

dotenv.config();
colors.enable();

// Retrieve http server port number
const port: string | undefined = process.env.PORT;

declare module 'socket.io' {
  interface Socket {
    userId: string;
  }
}

require('./models/User');

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

// Register routes
app.use(require('./routes/auth-routes'));
app.use(require('./routes/moderator-routes'));
app.use(require('./routes/user-routes'));
app.use(require('./routes/relationship-routes'));
app.use(require('./routes/notification-routes'));
app.use(require('./routes/chat-routes'));

registerRoutes(app);

// Http server creation
export const httpServer: http.Server = http.createServer(app);

// Io server creation
const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:4200` },
});

// ioServer configuration
ioServer.use((client, next) => {
  const userId = client.handshake.auth.userId;
  client.userId = userId;
  next();
});

ioServer.on('connection', (client: io.Socket) => {
  /**
   *
   */
  const serverJoined = new ServerJoined(client);
  serverJoined.listen();

  /**
   *
   */
  const chatJoined = new ChatJoinedListener(client);
  chatJoined.listen();

  /**
   *
   */
  const chatLeft = new ChatLeftListener(client);
  chatLeft.listen();
});

// Finally start http server
httpServer.listen(port, () => {
  console.log(`[${colors.blue('server')}]: Server is running at http://localhost:${port}`);
});
