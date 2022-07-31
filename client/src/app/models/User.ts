/**
 * Enum that represents the user status.
 */
export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
}

/**
 * Enum that represents the user roles.
 */
export enum UserRoles {
  Admin = 'Admin',
  Moderator = 'Moderator',
  Standard = 'Standard',
}

/**
 * Interface that represents a user stats.
 */
export interface UserStats {
  elo: number;
  topElo: number;
  gamesWon: number;
  shipsDestroyed: number;
  totalShots: number;
}

/**
 * Interface that represents a user.
 */
export interface User {
  userId: string;
  username: string;
  status: UserStatus;
  online: boolean;
  stats: UserStats;
  imagePath: string;
  roles: UserRoles[];
}
