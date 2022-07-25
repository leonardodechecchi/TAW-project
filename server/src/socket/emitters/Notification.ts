import { Server } from 'socket.io';
import { Notification } from '../../models/Notification';
import { RoomEmitter } from './RoomEmitter';

export class NotificationEmitter extends RoomEmitter<Notification> {
  /**
   * @param ioServer the socket server
   * @param userId the user id to notify
   */
  constructor(ioServer: Server, userId: string) {
    super(ioServer, 'notification', userId);
  }
}
