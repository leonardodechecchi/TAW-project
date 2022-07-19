import { HydratedDocument, Model, model, Schema, SchemaTypes, Types } from 'mongoose';
import { ChatDocument, createChat } from './Chat';
import { Grid } from './Grid';
import { Player, playerSchema } from './Player';
import { StatusError } from './StatusError';

/**
 * Interface that represents a match within the database.
 */
export interface Match {
  player1: Player;
  player2: Player;
  playersChat: Types.ObjectId;
  observersChat: Types.ObjectId;
}

interface MatchProps {
  /**
   * @param grid
   */
  updatePlayerGrid: (playerUsername: string, grid: Grid) => Promise<MatchDocument>;
}

export interface MatchDocument extends HydratedDocument<Match, MatchProps> {}

export const matchSchema = new Schema<Match, Model<Match, {}, MatchProps>>({
  player1: {
    type: playerSchema,
    required: true,
  },
  player2: {
    type: playerSchema,
    required: true,
  },
  playersChat: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
  observersChat: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
});

matchSchema.method(
  'updatePlayerGrid',
  async function (this: MatchDocument, playerUsername: string, grid: Grid): Promise<MatchDocument> {
    this.player1.playerUsername === playerUsername
      ? (this.player1.grid = grid)
      : (this.player2.grid = grid);
    return this.save();
  }
);

export const MatchModel = model<Match, Model<Match, {}, MatchProps>>('Match', matchSchema);

/**
 * Create a match for the given players.
 * @param username1 the username of the first user
 * @param username2 the username of the second user
 * @returns a Promise of `MatchDocument`, i.e. the match created
 * @memberof Match
 */
export async function createMatch(username1: string, username2: string): Promise<MatchDocument> {
  try {
    const playersChat: ChatDocument = await createChat([username1, username2]);
    const observersChat: ChatDocument = await createChat([]);

    const match = new MatchModel({
      player1: { playerUsername: username1 },
      player2: { playerUsername: username2 },
      playersChat: playersChat._id,
      observersChat: observersChat._id,
    });
    return match.save();
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Return the match that match the given match id.
 * Return an error if the match does not exists.
 * @param matchId the match id
 * @returns a Promise of `MatchDocument`, i.e. the match found
 * @memberof Match
 */
export async function getMatchById(matchId: Types.ObjectId): Promise<MatchDocument> {
  try {
    const match = await MatchModel.findOne({ _id: matchId }).exec();
    if (!match) {
      return Promise.reject(new StatusError(404, 'Match not found'));
    }
    return Promise.resolve(match);
  } catch (err) {
    return Promise.reject(err);
  }
}
