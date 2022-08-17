import { Server } from 'socket.io';
import { createMatch, MatchDocument } from '../models/Match';
import { MatchmakingQueueModel, QueueEntry } from '../models/matchmaking/QueueEntry';
import { getUserById, UserDocument } from '../models/User';
import { MatchFoundEmitter } from '../socket/emitters/MatchFound';

export class MatchmakingEngine {
  /**
   *
   */
  private intervalId: NodeJS.Timer | null;

  /**
   *
   */
  private readonly ioServer: Server;

  /**
   *
   */
  private readonly pollingTime: number;

  public constructor(ioServer: Server, pollingTime: number = 5000) {
    this.intervalId = null;
    this.ioServer = ioServer;
    this.pollingTime = pollingTime;
  }

  /**
   *
   */
  public start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {}, this.pollingTime);
  }

  /**
   *
   * @returns
   */
  public stop(): void {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /**
   *
   */
  private async arrangeMatches(): Promise<void> {
    const queue: QueueEntry[] = await MatchmakingQueueModel.find({}).exec();

    while (queue.length > 1) {
      const player: QueueEntry | undefined = queue.pop();
      const opponent: QueueEntry | undefined = undefined; /** todo find opponent */
    }
  }

  /**
   *
   * @param player1
   * @param player2
   */
  private static arePlayersMatchable(player1: QueueEntry, player2: QueueEntry): boolean {
    const eloDiff: number = Math.abs(player1.elo - player2.elo);

    const isP1Skilled: boolean = eloDiff <= 200;
    const isP2Skilled: boolean = eloDiff <= 200;

    return isP1Skilled && isP2Skilled;
  }

  /**
   *
   * @param player1
   * @param player2
   */
  private async arrangeMatch(player1: QueueEntry, player2: QueueEntry): Promise<void> {
    const user1: UserDocument = await getUserById(player1.userId);
    const user2: UserDocument = await getUserById(player2.userId);

    const match: MatchDocument = await createMatch(user1.username, user2.username);

    const emitter1: MatchFoundEmitter = new MatchFoundEmitter(
      this.ioServer,
      player1.userId.toString()
    );
    const emitter2: MatchFoundEmitter = new MatchFoundEmitter(
      this.ioServer,
      player2.userId.toString()
    );

    emitter1.emit({ matchId: match._id.toString() });
    emitter2.emit({ matchId: match._id.toString() });
  }
}
