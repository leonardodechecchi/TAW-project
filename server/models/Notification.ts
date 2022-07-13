import { Schema, SchemaTypes, Types } from 'mongoose';

export enum NotificationType {
  FriendRequest = 'FriendRequest',
  MatchRequest = 'FriendRequest',
}

/**
 * Interface that represents a notification within the database.
 */
export interface Notification {
  senderId: Types.ObjectId;
  type: NotificationType;
}

export const notificationSchema: Schema = new Schema<Notification>(
  {
    senderId: {
      type: SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: SchemaTypes.String,
      required: true,
      enum: NotificationType,
    },
  },
  { _id: false }
);
