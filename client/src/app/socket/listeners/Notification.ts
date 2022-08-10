import { Socket } from 'socket.io-client';
import { Notification } from 'src/app/models/Notification';
import { Listener } from './Listener';

export class NotificationListener extends Listener<Notification> {
  constructor(socket: Socket) {
    super(socket, 'notification');
  }
}
