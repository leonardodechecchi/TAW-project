import { Model, Schema, SchemaTypes, Types } from 'mongoose';
import { GridCoordinates, gridCoordinatesSchema } from './GridCoordinates';

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
 * Interface that reoresents a ship within the databse.
 */
export interface Ship {
  shipType: ShipTypes;
  coordinates: GridCoordinates[];
}

interface ShipProps {
  coordinates: Types.DocumentArray<GridCoordinates>;
}

export const shipSchema = new Schema<Ship, Model<Ship, {}, ShipProps>>(
  {
    shipType: {
      type: SchemaTypes.String,
      required: true,
      enum: ShipTypes,
    },
    coordinates: {
      type: [gridCoordinatesSchema],
    },
  },
  { _id: false }
);
