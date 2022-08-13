import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Interface that represents a relationship within the database.
 */
export interface Relationship {
  friendId: Types.ObjectId;
  chatId?: Types.ObjectId;
}

export const relationshipSchema = new Schema<Relationship>(
  {
    friendId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    chatId: {
      type: SchemaTypes.ObjectId,
      ref: 'Chat',
    },
  },
  { _id: false }
);
