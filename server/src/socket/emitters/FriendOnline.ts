import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

/**
 *
 */
export class FriendOnlineEmitter extends RoomEmitter<string> {
  /**
   * @param ioServer the socket server
   * @param friendId the friend id
   */
  constructor(ioServer: Server, friendId: string) {
    super(ioServer, 'friend-online', friendId);
  }
}
