import { Model, Schema, Types } from 'mongoose';
import { Ship, shipSchema } from './Ship';
import { GridCoordinates, gridCoordinatesSchema } from './GridCoordinates';

/**
 * Interface that represents a grid within the database.
 */
export interface Grid {
  ships: Ship[];
  shotsReceived: GridCoordinates[];
}

interface GridProps {
  ships: Types.DocumentArray<Ship>;
  shotsReceived: Types.DocumentArray<GridCoordinates>;
}

export const gridSchema = new Schema<Grid, Model<Grid, {}, GridProps>>(
  {
    ships: {
      type: [shipSchema],
    },
    shotsReceived: {
      type: [gridCoordinatesSchema],
    },
  },
  { _id: false }
);
