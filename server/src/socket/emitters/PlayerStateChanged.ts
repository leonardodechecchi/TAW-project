import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface PlayerStateChangedData {
  message: string;
}

export class PlayerStateChangedEmitter extends RoomEmitter<PlayerStateChangedData> {
  /**
   * @param ioServer the socket server instance
   * @param matchId the id of the match
   */
  constructor(ioServer: Server, matchId: string) {
    console.log('player-state-changed');
    super(ioServer, 'player-state-changed', matchId);
  }
}
