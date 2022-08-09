import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

export class PositioningCompletedEmitter extends RoomEmitter<{}> {
  /**
   * @param ioServer the socket server instance
   * @param matchId the id of the match
   */
  constructor(ioServer: Server, matchId: string) {
    console.log('positioning-completed');
    super(ioServer, 'positioning-completed', matchId);
  }
}
