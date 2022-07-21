import { UserRoles, UserStatus } from './User';

export interface Token {
  userId: string;
  username: string;
  email: string;
  status: UserStatus;
  roles: UserRoles[];
}
