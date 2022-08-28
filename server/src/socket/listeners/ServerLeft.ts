import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { ioServer } from '../..';
import { getUserById, UserDocument } from '../../models/User';
import { retrieveId } from '../../utils/param-checking';
import { FriendOfflineEmitter } from '../emitters/FriendOffline';
import { Listener } from './Listener';

export class ServerLeft extends Listener<{}> {
  /**
   * @param client the socket client instance
   */
  constructor(client: Socket) {
    super(client, 'disconnect');
  }

  public listen() {
    super.listen(async () => {
      this.client.leave(this.client.userId);

      const userId: Types.ObjectId = retrieveId(this.client.userId);
      const user: UserDocument = await getUserById(userId);
      await user.setOnlineStatus(false);

      // inform other users
      user.relationships.map((relationship) => {
        new FriendOfflineEmitter(ioServer, relationship.friendId.toString()).emit({
          userId: user._id.toString(),
        });
      });

      console.log(`${this.client.userId} disconnected!`);
    });
  }
}
