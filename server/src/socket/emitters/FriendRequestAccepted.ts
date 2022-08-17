import { Server } from 'socket.io';
import { UserStats } from '../../models/UserStats';
import { RoomEmitter } from './RoomEmitter';

interface FriendRequestAcceptedData {
  friendId: {
    _id: string;
    username: string;
    online: boolean;
    stats: UserStats;
  };
}

export class FriendRequestAcceptedEmitter extends RoomEmitter<FriendRequestAcceptedData> {
  /**
   * @param ioServer the socket server
   * @param userId the user id where to emit
   */
  constructor(ioServer: Server, userId: string) {
    super(ioServer, 'friend-request-accepted', userId);
  }
}
