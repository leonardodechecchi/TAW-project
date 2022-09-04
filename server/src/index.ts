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
import { ChatLeftListener } from './socket/listeners/ChatLeft';
import { ServerLeft } from './socket/listeners/ServerLeft';
import { MatchJoinedListener } from './socket/listeners/MatchJoined';
import { MatchLeftListener } from './socket/listeners/MatchLeft';
import { MatchRequestAcceptedListener } from './socket/listeners/MatchRequestAccepted';
import { MatchRequestRejectedListener } from './socket/listeners/MatchRequestRejected';
import { Types } from 'mongoose';
import { getUserById, UserDocument } from './models/User';
import { retrieveId } from './utils/param-checking';
import { FriendOnlineEmitter } from './socket/emitters/FriendOnline';
import { MatchmakingEngine } from './matchmaking/matchmaking-engine';
import { MatchEndedListener } from './socket/listeners/MatchEnded';

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

// Register routes
registerRoutes(app);

// Http server creation
export const httpServer: http.Server = http.createServer(app);

// Socket server creation
export const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:4200` },
});

// Socket server configuration
ioServer.use(async (client, next) => {
  const id = client.handshake.auth.userId;
  client.userId = id;
  client.join(id);

  const userId: Types.ObjectId = retrieveId(client.userId);
  const user: UserDocument = await getUserById(userId);

  // set user status to online
  await user.setOnlineStatus(true);

  // inform other users
  user.relationships.map((relationship) => {
    new FriendOnlineEmitter(ioServer, relationship.friendId.toString()).emit({
      userId: user._id.toString(),
    });
  });

  console.log(`${client.userId} connected!`);
  next();
});

// Socket server events
ioServer.on('connection', (client: io.Socket) => {
  /**
   * Listen for server left event. Update the user status to offline
   * and inform user friends.
   */
  const serverLeft = new ServerLeft(client);
  serverLeft.listen();

  /**
   * Listen for chat joined event. Inform the users in the chat that a user
   * has joined the chat.
   */
  const chatJoined = new ChatJoinedListener(client);
  chatJoined.listen();

  /**
   * Listen for chat left event. Inform the users in the chat that a user
   * has left the chat.
   */
  const chatLeft = new ChatLeftListener(client);
  chatLeft.listen();

  /**
   * Listen for match request accepted event. Inform the user that
   * the opponent has accepted the match and the game is going to start.
   */
  const matchRequestAccepted = new MatchRequestAcceptedListener(ioServer, client);
  matchRequestAccepted.listen();

  /**
   * Listen for match request rejected event. Inform the user that
   * the opponent has rejected the match.
   */
  const matchRequestRejected = new MatchRequestRejectedListener(ioServer, client);
  matchRequestRejected.listen();

  /**
   * Listen for match joined event. The user who join the match will
   * be pushed into the room (the matchId).
   */
  const matchJoined = new MatchJoinedListener(client);
  matchJoined.listen();

  /**
   * Listen for match left event. It informs the opponent and the
   * observers that the other player has left the match.
   */
  const matchLeft = new MatchLeftListener(ioServer, client);
  matchLeft.listen();

  /**
   * Listen for match ended event. It informs the opponent and the
   * observers that the match is ended and update the players elo scores.
   */
  const matchEnded = new MatchEndedListener(client);
  matchEnded.listen();
});

/**
 * Start the matchmaking engine.
 */
const matchmakingEngine = new MatchmakingEngine(ioServer, 5000);
matchmakingEngine.start();

/**
 * Finally start http server
 */

httpServer.listen(port, () => {
  console.log(`[${colors.blue('server')}]: Server is running at http://localhost:${port}`);
});
