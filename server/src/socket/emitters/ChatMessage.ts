import { Server } from 'socket.io';
import { Message } from '../../models/Message';
import { RoomEmitter } from './RoomEmitter';

export class ChatMessageEmitter extends RoomEmitter<Message> {
  /**
   * @param ioServer the socket server
   * @param roomId the room id to send the message
   */
  constructor(ioServer: Server, roomId: string) {
    super(ioServer, 'chat-message', roomId);
  }
}
