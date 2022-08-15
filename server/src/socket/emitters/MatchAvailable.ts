import { Server } from 'socket.io';
import { Match } from '../../models/Match';
import { Emitter } from './Emitter';

interface MatchAvailableData {
  match: Match;
}

export class MatchAvailableEmitter extends Emitter<MatchAvailableData> {
  /**
   * @param ioServer the socket server
   */
  constructor(ioServer: Server) {
    super(ioServer, 'match-available');
  }
}
