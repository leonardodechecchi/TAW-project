import { Observable, Subscriber } from 'rxjs';
import { Socket } from 'socket.io-client';

export abstract class Listener<T> {
  public readonly socket: Socket;
  public readonly event: string;

  constructor(socket: Socket, event: string) {
    this.socket = socket;
    this.event = event;
  }

  public connect(): Observable<T> {
    return new Observable<T>((subscriber: Subscriber<T>) => {
      this.socket.on(this.event, (eventData: T) => {
        subscriber.next(eventData);
      });

      return () => {
        this.socket.removeListener(this.event);
      };
    });
  }
}
