import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

export class PlayerStateChangedEmitter extends RoomEmitter<{}> {
  /**
   * @param ioServer the socket server instance
   * @param matchId the id of the match
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'player-state-changed', matchId);
  }
}
