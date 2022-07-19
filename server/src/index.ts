import http from 'http';
import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import { StatusError } from './models/StatusError';
import io from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';
import { registerRoutes } from './utils/register-routes';

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

// Http server creation
const httpServer: http.Server = http.createServer(app);

// Io server creation
const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:${port}` },
});

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

// ioServer configuration
ioServer.use((client, next) => {
  const userId = client.handshake.auth.userId;
  client.userId = userId;
  next();
});

ioServer.on('connection', (client: io.Socket) => {
  client.join(client.userId);
  console.log(`[${colors.blue('socket')}]: client ${client.userId} connected`);
});

// Register routes
registerRoutes(app);

// Finally start http server
httpServer.listen(port, () => {
  console.log(`[${colors.blue('server')}]: Server is running at http://localhost:${port}`);
});
