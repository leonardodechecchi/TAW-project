import { Types } from 'mongoose';
import { Server } from 'socket.io';
import { NotificationType } from '../../models/Notification';
import { RoomEmitter } from './RoomEmitter';

interface Notification {
  senderId: {
    _id: Types.ObjectId;
    username: string;
  };
  type: NotificationType;
}

export class NotificationEmitter extends RoomEmitter<Notification> {
  /**
   * @param ioServer the socket server
   * @param userId the user id to notify
   */
  constructor(ioServer: Server, userId: string) {
    super(ioServer, 'notification', userId);
  }
}
