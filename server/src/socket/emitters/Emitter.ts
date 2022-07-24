import { Server } from 'socket.io';

/**
 *
 */
export abstract class Emitter<T> {
  protected ioServer: Server;
  protected eventName: string;

  protected constructor(ioServer: Server, eventName: string) {
    this.ioServer = ioServer;
    this.eventName = eventName;
  }

  public emit(data?: T) {
    this.ioServer.emit(this.eventName, data);
  }
}
