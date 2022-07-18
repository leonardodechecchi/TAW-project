import { Schema, SchemaTypes } from 'mongoose';

/**
 * Interface that represents a single coordinate of the grid.
 */
export interface GridCoordinates {
  row: number;
  col: number;
}

export const gridCoordinatesSchema = new Schema<GridCoordinates>(
  {
    row: {
      type: SchemaTypes.Number,
      required: true,
    },
    col: {
      type: SchemaTypes.Number,
      required: true,
    },
  },
  { _id: false }
);
