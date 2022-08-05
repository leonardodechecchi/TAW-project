import { Socket } from 'socket.io';

/**
 * Abstract class that wraps socket listening functionality.
 * Listen to client emitted events.
 */
export abstract class Listener<T> {
  protected readonly client: Socket;
  protected readonly eventName: string;

  protected constructor(client: Socket, eventName: string) {
    this.client = client;
    this.eventName = eventName;
  }

  protected listen(listener: (data: T) => void): void {
    this.client.on(this.eventName, listener);
  }
}
