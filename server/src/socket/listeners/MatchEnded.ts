import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { getMatchById, MatchDocument } from '../../models/Match';
import { getUserByUsername, UserDocument } from '../../models/User';
import { retrieveId } from '../../utils/param-checking';
import { Listener } from './Listener';

interface MatchEndedData {
  matchId: string;
}

export class MatchEndedListener extends Listener<MatchEndedData> {
  constructor(client: Socket) {
    super(client, 'match-ended');
  }

  public async listen() {
    super.listen(async (eventData: MatchEndedData) => {
      const matchId: Types.ObjectId = retrieveId(eventData.matchId);
      const match: MatchDocument = await getMatchById(matchId);

      const userA: UserDocument = await getUserByUsername(match.player1.playerUsername);
      const userB: UserDocument = await getUserByUsername(match.player2.playerUsername);

      const ratingADifference: number = userB.stats.elo - userA.stats.elo;
      const ratingBDifference: number = userA.stats.elo - userB.stats.elo;

      const playerAProbability: number =
        1 / (match.stats.winner === userA.username ? 1 : 0 + Math.pow(10, ratingADifference / 400));
      const playerBProbability: number =
        1 / (match.stats.winner === userB.username ? 1 : 0 + Math.pow(10, ratingBDifference / 400));

      userA.stats.elo += 10 * (match.stats.winner === userA.username ? 1 : 0 - playerAProbability);
      userB.stats.elo += 10 * (match.stats.winner === userB.username ? 1 : 0 - playerBProbability);

      await userA.save();
      await userB.save();
    });
  }
}
