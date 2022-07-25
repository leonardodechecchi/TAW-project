import { Socket } from 'socket.io';
import { Listener } from './Listener';
import colors from 'colors';

export class ChatJoinedListener extends Listener<string> {
  constructor(client: Socket) {
    super(client, 'chat-joined');
  }

  public listen() {
    super.listen((chatId) => {
      this.client.join(chatId);
      console.log(`[${colors.blue('socket')}]: client ${this.client.userId} joined room ${chatId}`);
    });
  }
}
