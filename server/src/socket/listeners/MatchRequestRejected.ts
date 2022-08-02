import { Server, Socket } from 'socket.io';
import { MatchRejectedEmitter } from '../emitters/MatchRejected';
import { ListenerNotifier } from './ListenerNotifier';

/**
 *
 */
export class MatchRequestRejectedListener extends ListenerNotifier<string, string> {
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'match-rejected');
  }

  public listen() {
    const emitterProvider = (userId: string) => {
      const emitters = [new MatchRejectedEmitter(this.ioServer, userId)];
      return emitters;
    };

    super.listenAndEmit(emitterProvider);
  }
}
