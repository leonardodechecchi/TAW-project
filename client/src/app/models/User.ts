/**
 * Enum that represents the user status.
 */
export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
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
  roles: string[];
}
