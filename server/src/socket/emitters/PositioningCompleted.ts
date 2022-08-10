import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface PositioningCompletedData {
  message: string;
}

export class PositioningCompletedEmitter extends RoomEmitter<PositioningCompletedData> {
  /**
   * @param ioServer the socket server instance
   * @param matchId the id of the match
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'positioning-completed', matchId);
  }
}
