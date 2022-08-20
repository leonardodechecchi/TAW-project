import { Socket } from 'socket.io';
import { Listener } from './Listener';

export class ChatJoinedListener extends Listener<string> {
  /**
   * @param client the client instance
   */
  constructor(client: Socket) {
    super(client, 'chat-joined');
  }

  public listen() {
    super.listen((chatId) => {
      this.client.join(chatId);
      console.log(`${this.client.userId} joined room ${chatId}!`);
    });
  }
}
