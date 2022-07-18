import { Schema, SchemaTypes, Types } from 'mongoose';
import { Grid, gridSchema } from './Grid';

/**
 * Interface that represents a player within the database.
 */
export interface Player {
  playerId: Types.ObjectId;
  grid: Grid;
  ready: boolean;
}

export const playerSchema = new Schema<Player>({
  playerId: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  grid: {
    type: gridSchema,
    required: true,
  },
  ready: {
    type: SchemaTypes.Boolean,
    required: true,
    default: false,
  },
});
