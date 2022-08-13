import { Types, Schema, SchemaTypes } from 'mongoose';

/**
 * Interface that represents a chat message within the database.
 */
export interface Message {
  author: string;
  content: string;
  date: Date;
}

export const messageSchema = new Schema<Message>(
  {
    author: {
      type: SchemaTypes.String,
      required: true,
    },
    content: {
      type: SchemaTypes.String,
      required: true,
    },
    date: {
      type: SchemaTypes.Date,
      required: true,
      default: new Date(),
    },
  },
  { _id: false }
);
