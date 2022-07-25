import { Socket } from 'socket.io';
import { Listener } from './Listener';
import colors from 'colors';

export class ServerLeft extends Listener<{}> {
  constructor(client: Socket) {
    super(client, 'disconnect');
  }

  public listen() {
    super.listen(() => {
      for (let room in this.client.rooms) this.client.leave(room);
      console.log(`[${colors.blue('socket')}]: client ${this.client.userId} disconnected`);
    });
  }
}
