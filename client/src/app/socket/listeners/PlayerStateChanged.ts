import { Socket } from 'socket.io-client';
import { Listener } from './Listener';

interface PlayerStateChangedData {
  message: string;
}

export class PlayerStateChangedListener extends Listener<PlayerStateChangedData> {
  constructor(socket: Socket) {
    super(socket, 'player-state-changed');
  }
}
