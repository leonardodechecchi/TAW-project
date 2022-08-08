import { Socket } from 'socket.io';
import { Listener } from './Listener';

interface MatchJoinedData {
  matchId: string;
}

export class MatchJoinedListener extends Listener<MatchJoinedData> {
  /**
   * @param client the client instance
   */
  constructor(client: Socket) {
    super(client, 'match-joined');
  }

  public listen(): void {
    super.listen((eventData): void => {
      this.client.join(eventData.matchId);
      console.log(`${this.client.userId} joined match ${eventData.matchId}`);
    });
  }
}
