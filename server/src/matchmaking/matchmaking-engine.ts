import { Server } from 'socket.io';
import { MatchmakingQueueModel, QueueEntry, QueueEntryDocument } from '../models/QueueEntry';

export class MatchmakingEngine {
  /**
   *
   */
  private _intervalId: NodeJS.Timer;

  /**
   *
   */
  private readonly _sIoServer: Server;

  /**
   *
   */
  private readonly _pollingTime: number;

  public constructor(sIoServer: Server, pollingTime: number = 5000) {
    this._intervalId = null;
    this._sIoServer = sIoServer;
    this._pollingTime = pollingTime;
  }

  /**
   *
   */
  public start(): void {
    if (this._intervalId !== null) {
      return;
    }

    this._intervalId = setTimeout(this.arrangeMatches, this._pollingTime);
  }

  /**
   *
   */
  private async arrangeMatches(): Promise<void> {
    const queue: QueueEntryDocument[] = await MatchmakingQueueModel.find({}).sort({
      queuedSince: 1,
    });

    while (queue.length > 1) {
      console.log('arranging matches...');
      const player: QueueEntryDocument = queue.pop();
      const opponent: QueueEntryDocument | null = this.findOpponent(player, queue);

      if (opponent !== null) {
        await this.arrangeMatch(player, opponent);
      }
    }
  }

  /**
   *
   * @param player
   * @param queue
   * @returns
   */
  private findOpponent(
    player: QueueEntryDocument,
    queue: QueueEntryDocument[]
  ): QueueEntryDocument | null {
    const potentialOpponents: QueueEntryDocument[] = queue.filter((entry) => {
      return this.arePlayersMatchable(player, entry);
    });

    if (potentialOpponents.length === 0) return null;

    potentialOpponents.sort((entry1: QueueEntryDocument, entry2: QueueEntryDocument) => {
      if (entry1.queuedSince < entry2.queuedSince) return 1;
      else if (entry1.queuedSince > entry2.queuedSince) return -1;
      else return 0;
    });

    return potentialOpponents.pop();
  }

  /**
   *
   * @param player1
   * @param player2
   */
  private arePlayersMatchable(player1: QueueEntryDocument, player2: QueueEntryDocument): boolean {
    const p1EloDelta: number = this.getEloDelta(player1);
    const p2EloDelta: number = this.getEloDelta(player2);
    const eloDiff: number = Math.abs(player1.elo - player2.elo);

    const isP1Skill: boolean = eloDiff <= p1EloDelta;
    const isP2Skill: boolean = eloDiff <= p2EloDelta;

    return isP1Skill && isP2Skill;
  }

  /**
   *
   * @param player
   * @returns
   */
  private getEloDelta(player: QueueEntry): number {
    const startingDelta: number = 100;
    const timeBeforeIncreaseMs: number = 5000;

    // Delta's multiplier depends on time spent in queue
    // The more time he spent there, the more the delta is wide,
    // which means that a match should be found more easily
    const timeSpentInQueueMs: number = player.queuedSince.getMilliseconds();
    const multiplier = Math.ceil(timeSpentInQueueMs / timeBeforeIncreaseMs);

    return startingDelta * multiplier;
  }

  /**
   *
   * @param player1
   * @param player2
   */
  private async arrangeMatch(
    player1: QueueEntryDocument,
    player2: QueueEntryDocument
  ): Promise<void> {
    console.log('creating match...');
    /*
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
    */
  }

  /**
   *
   * @returns
   */
  public stop(): void {
    if (this._intervalId === null) {
      return;
    }

    clearInterval(this._intervalId);
    this._intervalId = null;
  }
}
