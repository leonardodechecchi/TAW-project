import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface MatchRejectData {
  message: string;
}

export class MatchRejectedEmitter extends RoomEmitter<MatchRejectData> {
  /**
   * @param ioServer the socket server instance
   * @param userId the id of the player to be notified
   */
  constructor(ioServer: Server, userId: string) {
    super(ioServer, 'match-reject', userId);
  }
}
