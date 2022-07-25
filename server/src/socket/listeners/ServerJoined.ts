import { Socket } from 'socket.io';
import { Listener } from './Listener';
import colors from 'colors';

export class ServerJoined extends Listener<{}> {
  constructor(client: Socket) {
    super(client, 'server-joined');
  }

  public listen() {
    super.listen(() => {
      this.client.join(this.client.userId);
      console.log(`[${colors.blue('socket')}]: client ${this.client.userId} connected`);
    });
  }
}
