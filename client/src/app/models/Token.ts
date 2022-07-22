import { UserStatus, UserRoles } from './User';

export interface Token {
  userId: string;
  username: string;
  email: string;
  status: UserStatus;
  roles: UserRoles[];
  iat: number;
  exp: number;
}
