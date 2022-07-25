import { Server } from 'socket.io';
import { Emitter } from './Emitter';

/**
 * Abstract class that wraps socket emitter functionality.
 * Emits events to a subset of clients.
 */
export abstract class RoomEmitter<T> extends Emitter<T> {
  public readonly roomName: string;

  constructor(ioServer: Server, eventName: string, roomName: string) {
    super(ioServer, eventName);
    this.roomName = roomName;
  }

  public emit(data?: T) {
    this.ioServer.to(this.roomName).emit(this.eventName, data);
  }
}
