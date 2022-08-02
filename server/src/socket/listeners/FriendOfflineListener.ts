import { Server, Socket } from 'socket.io';
import { ListenerNotifier } from './ListenerNotifier';

/**
 *
 */
export class FriendOfflineListener extends ListenerNotifier<{}, {}> {
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'friend-offline');
  }

  public listen() {
    const emitterProvider = () => {};
  }
}
