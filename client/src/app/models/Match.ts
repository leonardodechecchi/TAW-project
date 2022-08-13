import { Player } from './Player';

export interface Match {
  readonly _id: string;
  player1: Player;
  player2: Player;
  turnOf: string;
  playersChat: string;
  observersChat: string;
}
