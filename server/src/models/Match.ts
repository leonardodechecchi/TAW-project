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
   * Update the corresponding player grid.
   * @param playerUsername the player username
   * @param grid the player grid filled
   */
  updatePlayerGrid: (playerUsername: string, grid: Grid) => Promise<MatchDocument>;

  /**
   * Set the player status to ready. This meeans that the player is
   * ready to play.
   * @param playerUsername the player username
   */
  setPlayerReady: (playerUsername: string, isReady: boolean) => Promise<MatchDocument>;
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

matchSchema.method(
  'setPlayerReady',
  async function (
    this: MatchDocument,
    playerUsername: string,
    isReady: boolean
  ): Promise<MatchDocument> {
    this.player1.playerUsername === playerUsername
      ? (this.player1.ready = isReady)
      : (this.player2.ready = isReady);
    return this.save();
  }
);

export const MatchModel = model<Match, Model<Match, {}, MatchProps>>('Match', matchSchema);

/**
 * Create a match for the given players.
 * @param username1 the username of the first user
 * @param username2 the username of the second user
 * @returns a Promise of `MatchDocument`, i.e. the match created
 */
export async function createMatch(username1: string, username2: string): Promise<MatchDocument> {
  const playersChat: ChatDocument = await createChat([username1, username2]);
  const observersChat: ChatDocument = await createChat([]);

  const match = new MatchModel({
    player1: { playerUsername: username1 },
    player2: { playerUsername: username2 },
    playersChat: playersChat._id,
    observersChat: observersChat._id,
  });
  return match.save();
}

/**
 * Return the match that match the given match id.
 * Return an error if the match does not exists.
 * @param matchId the match id
 * @returns a Promise of `MatchDocument`, i.e. the match found
 */
export async function getMatchById(matchId: Types.ObjectId): Promise<MatchDocument> {
  const match = await MatchModel.findOne({ _id: matchId }).exec();
  if (!match) {
    return Promise.reject(new StatusError(404, 'Match not found'));
  }
  return Promise.resolve(match);
}
