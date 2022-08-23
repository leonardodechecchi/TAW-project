import { Schema, SchemaTypes } from 'mongoose';

/**
 * Subdocument of User that represents the user statistics.
 */
export interface UserStats {
  elo: number;
  topElo: number;
  gamesWon: number;
  numOfGamesPlayed: number;
  totalShots: number;
}

export const userStatsSchema = new Schema<UserStats>(
  {
    elo: {
      type: SchemaTypes.Number,
      default: 0,
    },
    topElo: {
      type: SchemaTypes.Number,
      default: 0,
    },
    gamesWon: {
      type: SchemaTypes.Number,
      default: 0,
    },
    numOfGamesPlayed: {
      type: SchemaTypes.Number,
      default: 0,
    },
    totalShots: {
      type: SchemaTypes.Number,
      default: 0,
    },
  },
  { _id: false }
);
