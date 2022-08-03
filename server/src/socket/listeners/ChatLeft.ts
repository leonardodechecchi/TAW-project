import { Socket } from 'socket.io';
import { Listener } from './Listener';

/**
 *
 */
export class ChatLeftListener extends Listener<string> {
  constructor(client: Socket) {
    super(client, 'chat-left');
  }

  public listen() {
    super.listen((chatId) => {
      this.client.leave(chatId);
      console.log(`${this.client.userId} left room ${chatId}!`);
    });
  }
}
