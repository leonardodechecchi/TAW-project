import { model, Schema, SchemaTypes, Types } from 'mongoose';
import { Player, playerSchema } from './Player';

/**
 * Interface that represents a match within the database.
 */
export interface Match {
  player1: Player;
  player2: Player;
  playersChat: Types.ObjectId;
  observersChat: Types.ObjectId;
}

export const matchSchema = new Schema<Match>({
  player1: {
    type: playerSchema,
    required: true,
  },
  player2: {
    type: playerSchema,
    required: true,
  },
  playersChat: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  observersChat: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
});

export const MathModel = model<Match>('Match', matchSchema);
