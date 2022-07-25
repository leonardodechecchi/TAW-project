import { Socket } from 'socket.io';
import { Listener } from './Listener';
import colors from 'colors';

export class ChatLeftListener extends Listener<string> {
  constructor(client: Socket) {
    super(client, 'chat-left');
  }

  public listen() {
    super.listen((chatId) => {
      this.client.leave(chatId);
      console.log(
        `[${colors.blue('socket')}]: client ${this.client.userId} has left room ${chatId}`
      );
    });
  }
}
