import { Player } from './Player';

export interface Match {
  player1: Player;
  player2: Player;
  playersChat: string;
  observersChat: string;
}
