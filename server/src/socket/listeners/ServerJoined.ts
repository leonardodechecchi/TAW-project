import { Socket } from 'socket.io';
import { Listener } from './Listener';

/**
 *
 */
export class ServerJoined extends Listener<{}> {
  constructor(client: Socket) {
    super(client, 'server-joined');
  }

  public listen() {
    super.listen(() => {
      this.client.join(this.client.userId);
    });
  }
}
