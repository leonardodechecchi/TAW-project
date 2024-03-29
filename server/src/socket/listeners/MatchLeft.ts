import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { deleteMatchById } from '../../models/Match';
import { retrieveId } from '../../utils/param-checking';
import { MatchEndedEmitter } from '../emitters/MatchEnded';

import { ListenerNotifier } from './ListenerNotifier';

interface MatchLeftListenerData {
  matchId: string;
  playerWhoLeft: string;
}

interface MatchLeftEmitterData {
  matchId: string;
  message: string;
}

export class MatchLeftListener extends ListenerNotifier<
  MatchLeftListenerData,
  MatchLeftEmitterData
> {
  /**
   * @param ioServer the socket server instance
   * @param client the client instance
   */
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'match-left');
  }

  public async listen(): Promise<void> {
    const emitterProvider = async (
      eventData: MatchLeftListenerData
    ): Promise<MatchEndedEmitter[]> => {
      const emitter = new MatchEndedEmitter(this.ioServer, eventData.matchId);
      return Promise.resolve([emitter]);
    };

    const emitDataProvider = async (
      eventData: MatchLeftListenerData
    ): Promise<MatchLeftEmitterData> => {
      const matchId: Types.ObjectId = retrieveId(eventData.matchId);
      await deleteMatchById(matchId);

      return Promise.resolve({
        matchId: eventData.matchId,
        message: eventData.playerWhoLeft + ' has left the match',
      });
    };

    await super.listenAndEmit(emitterProvider, emitDataProvider);
  }
}
