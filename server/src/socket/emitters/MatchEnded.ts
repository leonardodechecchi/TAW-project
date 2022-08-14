import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface MatchEndedEmitterData {
  message: string;
}

export class MatchEndedEmitter extends RoomEmitter<MatchEndedEmitterData> {
  /**
   * @param ioServer the socket server
   * @param matchId the match id where to emit
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'match-ended', matchId);
  }
}
