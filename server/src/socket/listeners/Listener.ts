import { Socket } from 'socket.io';

/**
 * Abstract class that wraps socket listening functionality.
 * Listen to client emitted events.
 */
export abstract class Listener<T> {
  public readonly client: Socket;
  public readonly eventName: string;

  constructor(client: Socket, eventName: string) {
    this.client = client;
    this.eventName = eventName;
  }

  public listen(listener: (data: T) => void): void {
    this.client.on(this.eventName, listener);
  }
}
