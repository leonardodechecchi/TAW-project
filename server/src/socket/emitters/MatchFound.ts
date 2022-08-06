import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface MatchData {
  matchId: string;
}

export class MatchFoundEmitter extends RoomEmitter<MatchData> {
  /**
   * @param ioServer the socket server instance
   * @param playerId the id of the player to be notified
   */
  constructor(ioServer: Server, playerId: string) {
    super(ioServer, 'match-found', playerId);
  }
}
