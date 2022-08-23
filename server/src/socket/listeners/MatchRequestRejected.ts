import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { getUserById, UserDocument } from '../../models/User';
import { retrieveId } from '../../utils/param-checking';
import { MatchRejectedEmitter } from '../emitters/MatchRejected';
import { ListenerNotifier } from './ListenerNotifier';

interface MatchRequestRejectedData {
  senderId: string;
}

interface MatchRejectData {
  message: string;
}

export class MatchRequestRejectedListener extends ListenerNotifier<
  MatchRequestRejectedData,
  MatchRejectData
> {
  /**
   * @param ioServer the socket server instance
   * @param client the client instance
   */
  constructor(ioServer: Server, client: Socket) {
    super(ioServer, client, 'match-rejected');
  }

  public async listen(): Promise<void> {
    const emitterProvider = async (
      eventData: MatchRequestRejectedData
    ): Promise<MatchRejectedEmitter[]> => {
      console.log(eventData);
      const emitter = new MatchRejectedEmitter(this.ioServer, eventData.senderId);
      return Promise.resolve([emitter]);
    };

    const emitDataProvider = async (
      eventData: MatchRequestRejectedData
    ): Promise<MatchRejectData> => {
      const userId: Types.ObjectId = retrieveId(eventData.senderId);
      const user: UserDocument = await getUserById(userId);

      return Promise.resolve({ message: `${user.username} has rejected your match request` });
    };

    await super.listenAndEmit(emitterProvider, emitDataProvider);
  }
}
