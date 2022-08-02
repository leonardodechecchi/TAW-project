import { Server, Socket } from 'socket.io';
import { Emitter } from '../emitters/Emitter';
import { Listener } from './Listener';

/**
 *
 */
export abstract class ListenerNotifier<T, E> extends Listener<T> {
  protected readonly ioServer: Server;

  constructor(ioServer: Server, client: Socket, eventName: string) {
    super(client, eventName);
    this.ioServer = ioServer;
  }

  public listenAndEmit(
    emitterProvider: (eventData: T) => Emitter<E>[],
    emitDataProvider?: (eventData?: T) => E
  ): void {
    super.listen((eventData: T) => {
      const emitters: Emitter<E>[] = emitterProvider(eventData);
      const emitData: E | undefined = emitDataProvider ? emitDataProvider() : undefined;

      emitters.forEach((emitter) => {
        emitter.emit(emitData);
      });
    });
  }
}
