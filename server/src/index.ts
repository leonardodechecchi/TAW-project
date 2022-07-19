import http from 'http';
import express, { ErrorRequestHandler, Express, RequestHandler } from 'express';
import { StatusError } from './models/StatusError';
import io from 'socket.io';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
colors.enable();

// Retrieve http server port number
const port: string | undefined = process.env.PORT;

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

// Middleware for error handling
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof StatusError) {
    return res.status(err.statusCode).send(err.message);
  }
  console.log(err);
  return res.status(500).send(err.message);
};

// Middleware for invalid endpoint
const invalidEndpoint: RequestHandler = (req, res, next) => {
  return res.status(404).send('Invalid endpoint');
};

// Register routes
app.use(require('./routes/auth-routes'));
app.use(require('./routes/moderator-routes'));
app.use(require('./routes/user-routes'));
app.use(require('./routes/relationship-routes'));
app.use(require('./routes/notification-routes'));
app.use(require('./routes/chat-routes'));
app.use(require('./routes/error-routes'));
app.use(errorHandler);
app.use(invalidEndpoint);

// Finally start http server
httpServer.listen(port, () => {
  console.log(`[${colors.blue('server')}]: Server is running at http://localhost:${port}`);
});
