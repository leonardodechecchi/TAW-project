import { Server } from 'socket.io';
import { createMatch, MatchDocument } from '../models/Match';
import {
  deleteQueueEntry,
  MatchmakingQueueModel,
  QueueEntry,
  QueueEntryDocument,
} from '../models/QueueEntry';
import { getUserById, UserDocument } from '../models/User';
import { MatchFoundEmitter } from '../socket/emitters/MatchFound';

export class MatchmakingEngine {
  /**
   * The timer id.
   */
  private timeoutId: NodeJS.Timer;

  /**
   * The socket io server instance.
   */
  private readonly ioServer: Server;

  /**
   * The time to wait before the server start to work.
   */
  private readonly pollingTime: number;

  public constructor(ioServer: Server, pollingTime: number = 5000) {
    this.timeoutId = null;
    this.ioServer = ioServer;
    this.pollingTime = pollingTime;
  }

  /**
   * Start the matchmaking engine
   */
  public start(): void {
    if (this.timeoutId !== null) {
      throw new Error('Matchmaking engine already started');
    }

    this.refreshMatchmakingEngine();
  }

  /**
   * Refresh the matchmaking engine.
   */
  private refreshMatchmakingEngine(): void {
    this.timeoutId = setTimeout(async () => {
      await this.arrangeMatches();
    }, this.pollingTime);
  }

  /**
   *
   */
  private async arrangeMatches(): Promise<void> {
    const queue: QueueEntryDocument[] = await MatchmakingQueueModel.find({}).sort({
      queuedSince: 1,
    });

    while (queue.length > 1) {
      const player: QueueEntryDocument = queue.pop();
      const opponent: QueueEntryDocument | null = this.findOpponent(player, queue);

      if (opponent !== null) {
        await this.arrangeMatch(player, opponent);
      }
    }

    this.refreshMatchmakingEngine();
  }

  /**
   * Find a potential opponent for the given player.
   * @param player the player
   * @param queue the matchmaking queue
   * @returns the opponent or `null` if no potential player has been found
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
   * Check if the given players are matchable based on their elo points.
   * @param player1 the first player
   * @param player2 the second player
   * @returns `true` if the players are matchable, `false` otherwise
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
   * Create a match for the matched players and inform them.
   * @param player1 the first player
   * @param player2 the second player
   */
  private async arrangeMatch(
    player1: QueueEntryDocument,
    player2: QueueEntryDocument
  ): Promise<void> {
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

    await deleteQueueEntry(user1._id);
    await deleteQueueEntry(user2._id);

    emitter1.emit({ matchId: match._id.toString() });
    emitter2.emit({ matchId: match._id.toString() });
  }
}
