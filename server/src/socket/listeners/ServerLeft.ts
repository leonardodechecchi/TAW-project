import { Socket } from 'socket.io';
import { Listener } from './Listener';

/**
 *
 */
export class ServerLeft extends Listener<{}> {
  constructor(client: Socket) {
    super(client, 'disconnect');
  }

  public listen() {
    super.listen(async () => {
      for (let room in this.client.rooms) this.client.leave(room);
      console.log(`${this.client.userId} disconnected!`);
    });
  }
}
