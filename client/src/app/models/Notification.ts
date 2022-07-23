/**
 * Enum that represents a notification type.
 */
export enum NotificationType {
  FriendRequest = 'FriendRequest',
  MatchRequest = 'MatchRequest',
}

/**
 * Interface that represents a notification.
 */
export interface Notification {
  senderId: {
    _id: string;
    username: string;
  };
  type: NotificationType;
}
