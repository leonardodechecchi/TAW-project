import dotenv from 'dotenv';
import http from 'http';
import express, { Express } from 'express';
import io from 'socket.io';
import passport from 'passport';
import cors from 'cors';

// TODO exit if something goes wrong
dotenv.config();

const port: string | undefined = process.env.PORT;

// setup db connection
require('./config/db');
require('./config/passport');

export const app: Express = express();
export const auth = passport.authenticate('jwt', { session: false });

const httpServer: http.Server = http.createServer(app);
const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:${port}` },
});

app.use(express.json());
app.use(cors());

app.use(require('./routes/logger-routes'));
app.use(require('./routes/auth-routes'));
app.use(require('./routes/user-routes'));
app.use(require('./routes/relationship-routes'));
app.use(require('./routes/error-routes'));

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
