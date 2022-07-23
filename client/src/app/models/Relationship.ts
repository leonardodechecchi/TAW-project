import { UserStats } from './User';

/**
 * Interface that represents a user relationship.
 */
export interface Relationship {
  friendId: {
    _id: string;
    username: string;
    online: boolean;
    stats: UserStats;
  };
  chatId: string;
}
