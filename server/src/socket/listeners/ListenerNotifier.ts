import { Server, Socket } from 'socket.io';
import { Emitter } from '../emitters/Emitter';
import { Listener } from './Listener';

/**
 *
 */
export abstract class ListenerNotifier<T, E> extends Listener<T> {
  protected readonly ioServer: Server;

  protected constructor(ioServer: Server, client: Socket, eventName: string) {
    super(client, eventName);
    this.ioServer = ioServer;
  }

  protected async listenAndEmit(
    emittersProvider: (eventData: T) => Promise<Emitter<E>[]>,
    emitDataProvider: (eventData: T) => Promise<E>
  ): Promise<void> {
    super.listen(async (eventData: T) => {
      const emitters: Emitter<E>[] = await emittersProvider(eventData);
      const emitData: E = await emitDataProvider(eventData);

      emitters.forEach((emitter) => {
        emitter.emit(emitData);
      });
    });
  }
}
