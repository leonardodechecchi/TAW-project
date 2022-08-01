import { Socket } from 'socket.io';
import { Listener } from './Listener';
import colors from 'colors';

/**
 *
 */
export class MatchJoinedListener extends Listener<string> {
  constructor(client: Socket) {
    super(client, 'match-joined');
  }

  public listen(): void {
    super.listen((matchId): void => {
      this.client.join(matchId);
    });
  }
}
