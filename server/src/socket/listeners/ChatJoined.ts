import { Socket } from 'socket.io';
import { Listener } from './Listener';

export class ChatJoinedListener extends Listener<{ chatId: string }> {
  constructor(client: Socket) {
    super(client, 'chat-joined');
  }

  listen() {
    super.listen((data) => {
      this.client.join(data.chatId);
    });
  }
}
