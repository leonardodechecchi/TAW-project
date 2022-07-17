import { Schema, SchemaTypes } from 'mongoose';

export interface UserStats {
  elo: number;
  topElo: number;
  gamesWon: number;
  shipsDestroyed: number;
  totalShots: number;
}

export const userStatsSchema: Schema = new Schema<UserStats>(
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
    shipsDestroyed: {
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
