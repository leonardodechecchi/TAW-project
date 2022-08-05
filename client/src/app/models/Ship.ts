import { GridCoordinates } from './GridCoordinates';

/**
 * Enum that represents a ship type.
 */
export enum ShipTypes {
  Destroyer = 'Destroyer',
  Cruiser = 'Cruiser',
  Battleship = 'Battleship',
  Carrier = 'Carrier',
}

/**
 * Interface that represents a ship.
 */
export interface Ship {
  shipType: ShipTypes;
  coordinates: GridCoordinates[];
}
