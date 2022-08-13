import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Enum that represents a notification type.
 */
export enum NotificationType {
  FriendRequest = 'FriendRequest',
  MatchRequest = 'MatchRequest',
}

/**
 * Interface that represents a notification within the database.
 */
export interface Notification {
  senderId: Types.ObjectId;
  type: NotificationType;
}

export const notificationSchema = new Schema<Notification>(
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
