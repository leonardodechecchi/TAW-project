import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface MatchData {
  matchId: string;
}

export class MatchFoundEmitter extends RoomEmitter<MatchData> {
  /**
   * @param ioServer the socket server instance
   * @param userId the id of the user to be notified
   */
  constructor(ioServer: Server, userId: string) {
    super(ioServer, 'match-found', userId);
  }
}
