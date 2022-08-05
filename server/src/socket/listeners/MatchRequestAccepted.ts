import { Server, Socket } from 'socket.io';
import { createMatch, MatchDocument } from '../../models/Match';
import { MatchFoundEmitter } from '../emitters/MatchFound';
import { ListenerNotifier } from './ListenerNotifier';

interface MatchRequestAcceptedData {
  player1: string;
  player2: string;
}

interface MatchData {
  matchId: string;
}

export class MatchRequestAcceptedListener extends ListenerNotifier<
  MatchRequestAcceptedData,
  MatchData
> {
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'match-request-accepted');
  }

  public listen() {
    const emitterProvider = async (eventData: MatchRequestAcceptedData) => {
      const emitter1 = new MatchFoundEmitter(this.ioServer, eventData.player1);
      const emitter2 = new MatchFoundEmitter(this.ioServer, eventData.player2);
      const emitters: MatchFoundEmitter[] = [emitter1, emitter2];
      return Promise.resolve(emitters);
    };

    const emitDataProvider = async (eventData: MatchRequestAcceptedData) => {
      const match: MatchDocument = await createMatch(eventData.player1, eventData.player2);
      return Promise.resolve({ matchId: match._id.toString() });
    };

    super.listenAndEmit(emitterProvider, emitDataProvider);
  }
}
