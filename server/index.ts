import http from 'http';
import express, { Express } from 'express';
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
export const app: Express = express();

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

// Register routes
app.use(require('./routes/auth-routes'));
app.use(require('./routes/user-routes'));
app.use(require('./routes/relationship-routes'));
app.use(require('./routes/notification-routes'));
app.use(require('./routes/error-routes'));

// Finally start http server
httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
