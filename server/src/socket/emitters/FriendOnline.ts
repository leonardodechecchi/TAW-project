import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface FriendOnlineEmitterData {
  userId: string;
}

export class FriendOnlineEmitter extends RoomEmitter<FriendOnlineEmitterData> {
  /**
   * @param ioServer the socket server istance
   * @param friendId the match id
   */
  constructor(ioServer: Server, friendId: string) {
    super(ioServer, 'friend-online', friendId);
  }
}
