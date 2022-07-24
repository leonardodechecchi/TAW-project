import { Socket } from 'socket.io';

/**
 *
 */
export abstract class Listener<T> {
  protected client: Socket;
  protected eventName: string;

  constructor(client: Socket, eventName: string) {
    this.client = client;
    this.eventName = eventName;
  }

  listen(listener: (data: T) => void): void {
    this.client.on(this.eventName, listener);
  }
}
