import { Server } from 'socket.io';
import { Emitter } from './Emitter';

interface MatchAvailableData {
  matchId: string;
}

export class MatchAvailableEmitter extends Emitter<MatchAvailableData> {
  /**
   * @param ioServer the socket server
   */
  constructor(ioServer: Server) {
    super(ioServer, 'match-available');
  }
}
