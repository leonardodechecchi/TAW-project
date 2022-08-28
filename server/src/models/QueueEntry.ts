import { Schema, SchemaTypes, Types, model, HydratedDocument } from 'mongoose';
import { StatusError } from './StatusError';

/**
 * Interface that represents a queue entry for the matchmaking engine.
 */
export interface QueueEntry {
  userId: Types.ObjectId;
  elo: number;
  queuedSince: Date;
}

export interface QueueEntryDocument extends HydratedDocument<QueueEntry> {}

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

/**
 * Delete the queue entry that match the given user id.
 * @param userId the user id
 */
export async function deleteQueueEntry(userId: Types.ObjectId): Promise<void> {
  const queueEntry: QueueEntryDocument | null = await MatchmakingQueueModel.findOneAndDelete({
    userId,
  }).exec();
  if (!queueEntry) {
    return Promise.reject(new StatusError(400, 'No queue entry found'));
  }
}
