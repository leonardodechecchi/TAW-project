import { Player } from './Player';

/**
 * Interface that represents a set of match stats.
 */
export interface MatchStats {
  winner: string;
  startTime: Date;
  endTime: Date;
  totalShots: number;
  shipsDestroyed: number;
}

/**
 * Interface that represents a match.
 */
export interface Match {
  readonly _id: string;
  player1: Player;
  player2: Player;
  turnOf: string;
  playersChat: string;
  observersChat: string;
  stats: MatchStats;
}
