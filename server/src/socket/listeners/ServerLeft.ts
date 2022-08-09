import { Socket } from 'socket.io';
import { Listener } from './Listener';

export class ServerLeft extends Listener<{}> {
  /**
   * @param client the socket client instance
   */
  constructor(client: Socket) {
    super(client, 'disconnect');
  }

  public listen() {
    super.listen(async () => {
      this.client.leave(this.client.userId);
      console.log(this.client.rooms);
      console.log(`${this.client.userId} disconnected!`);
    });
  }
}
