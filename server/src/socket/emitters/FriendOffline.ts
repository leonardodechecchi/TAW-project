import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

interface FriendOfflineEmitterData {
  userId: string;
}

export class FriendOfflineEmitter extends RoomEmitter<FriendOfflineEmitterData> {
  /**
   * @param ioServer the socket server istance
   * @param friendId the match id
   */
  constructor(ioServer: Server, friendId: string) {
    super(ioServer, 'friend-offline', friendId);
  }
}
