import { Socket } from 'socket.io';
import { Listener } from './Listener';

export class ServerJoined extends Listener<{}> {
  /**
   * @param client the socket client instance
   */
  constructor(client: Socket) {
    super(client, 'server-joined');
  }

  public listen() {
    super.listen(() => {
      this.client.join(this.client.userId);
      this.client.rooms.forEach((room) => {
        console.log('Server joined ' + room);
      });
      console.log(`${this.client.userId} connected!`);
    });
  }
}
