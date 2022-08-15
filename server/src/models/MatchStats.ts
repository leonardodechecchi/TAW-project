import { Schema, SchemaTypes, Types } from 'mongoose';

/**
 * Subdocument of Match that represents the match statistics.
 */
export interface MatchStats {
  winner: string;
  startTime: Date;
  endTime: Date;
  totalShots: number;
  shipsDestroyed: number;
}

export const matchStatsSchema = new Schema<MatchStats>(
  {
    winner: {
      type: SchemaTypes.String,
      default: null,
    },
    startTime: {
      type: SchemaTypes.Date,
      default: () => new Date(),
    },
    endTime: {
      type: SchemaTypes.Date,
      default: null,
    },
    totalShots: {
      type: SchemaTypes.Number,
      default: 0,
    },
    shipsDestroyed: {
      type: SchemaTypes.Number,
      default: 0,
    },
  },
  { _id: false }
);
