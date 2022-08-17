import { Schema, SchemaTypes, Types, model } from 'mongoose';

/**
 * Interface that represents a queue entry for the matchmaking engine.
 */
export interface QueueEntry {
  userId: Types.ObjectId;
  elo: number;
  queuedSince: Date;
}

export const queueEntrySchema = new Schema<QueueEntry>({
  userId: {
    type: SchemaTypes.ObjectId,
    required: true,
    unique: true,
  },
  elo: {
    type: SchemaTypes.Number,
    required: true,
  },
  queuedSince: {
    type: SchemaTypes.Date,
    required: true,
    default: () => new Date(),
  },
});

export const MatchmakingQueueModel = model<QueueEntry>('MatchmakingQueue', queueEntrySchema);
