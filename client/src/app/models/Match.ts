import { Player } from './Player';

export interface Match {
  player1: Player;
  player2: Player;
  turnOf: string;
  playersChat: string;
  observersChat: string;
}
