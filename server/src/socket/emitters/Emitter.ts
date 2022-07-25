import { Server } from 'socket.io';

/**
 * Abstract class that wraps socket emitter functionality.
 * Emits events to all the clients connected.
 */
export abstract class Emitter<T> {
  public readonly ioServer: Server;
  public readonly eventName: string;

  protected constructor(ioServer: Server, eventName: string) {
    this.ioServer = ioServer;
    this.eventName = eventName;
  }

  public emit(data?: T) {
    this.ioServer.emit(this.eventName, data);
  }
}
