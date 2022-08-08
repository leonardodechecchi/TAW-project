import { Grid } from './Grid';

export interface Player {
  playerUsername: string;
  grid: Grid;
  ready: boolean;
}
