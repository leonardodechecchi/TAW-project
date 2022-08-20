import { Socket } from 'socket.io';
import { Listener } from './Listener';

export class CloseConnectionListener extends Listener<{}> {
  /**
   * @param client the client instance
   */
  constructor(client: Socket) {
    super(client, 'close-connection');
  }

  public listen() {
    super.listen(() => {
      this.client.disconnect();
      console.log(`${this.client.userId} disconnected!`);
    });
  }
}
