import { Types } from 'mongoose';
import { User, UserStatus } from '../models/User';
import { UserStats } from '../models/UserStats';

/**
 * Return only some fields of the user object.
 * @param user the user object
 * @returns the formatted user object
 */
export const formatUser = (
  user: User
): {
  userId: Types.ObjectId;
  name: string;
  surname: string;
  username: string;
  status: UserStatus;
  online: boolean;
  stats: UserStats;
  roles: string[];
} => {
  return {
    userId: user._id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    status: user.status,
    online: user.online,
    stats: user.stats,
    roles: user.roles,
  };
};
