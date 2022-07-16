import { Types } from 'mongoose';
import { User } from '../models/User';

/**
 * Return only some fields of the user object.
 * @param user the user object
 * @returns the formatted user object
 */
export const formatUser = (
  user: User
): {
  _id: Types.ObjectId;
  username: string;
  online: boolean;
  // stats: UserStats;
  roles: string[];
} => {
  return {
    _id: user._id,
    username: user.username,
    online: user.online,
    // stats: user.stats,
    roles: user.roles,
  };
};
