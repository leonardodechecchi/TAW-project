import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

/**
 *
 */
export class MatchRejectedEmitter extends RoomEmitter<string> {
  constructor(ioServer: Server, roomId: string) {
    super(ioServer, 'match-rejected', roomId);
  }
}
