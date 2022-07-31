import { Server } from 'socket.io';
import { RoomEmitter } from './RoomEmitter';

export class FriendOnlineEmitter extends RoomEmitter<{}> {
  /**
   * @param ioServer the socket server
   * @param roomId the room id to send the message
   */
  constructor(ioServer: Server, roomId: string) {
    super(ioServer, 'friend-online', roomId);
  }
}
