import { Server, Socket } from 'socket.io';
import { createMatch, MatchDocument } from '../../models/Match';
import { getUserByUsername, UserDocument } from '../../models/User';
import { MatchAvailableEmitter } from '../emitters/MatchAvailable';
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
  /**
   * @param ioServer the socket server instance
   * @param client the client instance
   */
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'match-request-accepted');
  }

  public async listen(): Promise<MatchFoundEmitter[]> {
    const emitterProvider = async (
      eventData: MatchRequestAcceptedData
    ): Promise<MatchFoundEmitter[]> => {
      const player1: UserDocument = await getUserByUsername(eventData.player1);
      const player2: UserDocument = await getUserByUsername(eventData.player2);

      const emitter1 = new MatchFoundEmitter(this.ioServer, player1._id.toString());
      const emitter2 = new MatchFoundEmitter(this.ioServer, player2._id.toString());
      const emitters: MatchFoundEmitter[] = [emitter1, emitter2];
      return Promise.resolve(emitters);
    };

    const emitDataProvider = async (eventData: MatchRequestAcceptedData): Promise<MatchData> => {
      const match: MatchDocument = await createMatch(eventData.player1, eventData.player2);

      // inform all users that a new match has started
      const matchAvailable = new MatchAvailableEmitter(this.ioServer);
      matchAvailable.emit({ match });

      return Promise.resolve({ matchId: match._id.toString() });
    };

    await super.listenAndEmit(emitterProvider, emitDataProvider);
  }
}
