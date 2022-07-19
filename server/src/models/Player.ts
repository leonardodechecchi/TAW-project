import { Model, Schema, SchemaTypes } from 'mongoose';
import { Grid, gridSchema } from './Grid';

/**
 * Interface that represents a player within the database.
 * Sub-document of the Match document.
 */
export interface Player {
  playerUsername: string;
  grid: Grid;
  ready: boolean;
}

export const playerSchema = new Schema<Player>({
  playerUsername: {
    type: SchemaTypes.String,
    required: true,
  },
  grid: {
    type: gridSchema,
    required: true,
    default: () => ({}),
  },
  ready: {
    type: SchemaTypes.Boolean,
    required: true,
    default: false,
  },
});
