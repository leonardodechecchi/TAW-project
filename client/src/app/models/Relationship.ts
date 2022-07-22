import { UserStats } from './User';

/**
 * Interface that represents a user relationship.
 */
export interface Relationship {
  friendId: {
    username: string;
    online: boolean;
    stats: UserStats;
  };
  chatId: string;
}
