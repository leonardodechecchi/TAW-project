import { Socket } from 'socket.io';
import { Listener } from './Listener';

/**
 *
 */
export class MatchLeftListener extends Listener<string> {
  constructor(client: Socket) {
    super(client, 'match-left');
  }

  public listen() {
    super.listen((matchId) => {
      this.client.leave(matchId);
    });
  }
}
