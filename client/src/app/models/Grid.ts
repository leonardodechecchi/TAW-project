import { GridCoordinates } from './GridCoordinates';
import { Ship } from './Ship';

/**
 * Interface that represents a game grid.
 */
export interface Grid {
  ships: Ship[];
  shotsReceived: GridCoordinates[];
}
