import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { Grid } from '../models/Grid';
import { createMatch, getMatchById, MatchDocument } from '../models/Match';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /matches/:matchId
 */
router.get('/matches/:matchId', auth, async (req: Request<{ matchId: string }>, res, next) => {
  try {
    const matchId: Types.ObjectId = retrieveId(req.params.matchId);
    const match: MatchDocument = await getMatchById(matchId);
    return res.status(200).json(match);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /matches
 */
router.post(
  '/matches',
  auth,
  async (req: Request<{}, {}, { username1: string; username2: string }>, res, next) => {
    try {
      const { username1, username2 } = req.body;
      const match: MatchDocument = await createMatch(username1, username2);

      // TODO emit message that the opponent accepted the match

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /matches/:matchId/players/:playerUsername/grid
 */
router.put(
  '/matches/:matchId/players/:playerUsername/grid',
  auth,
  async (
    req: Request<{ matchId: string; playerUsername: string }, {}, { grid: Grid }>,
    res,
    next
  ) => {
    try {
      const matchId: Types.ObjectId = retrieveId(req.params.matchId);
      const playerUsername: string = req.params.playerUsername;

      const match: MatchDocument = await getMatchById(matchId);
      await match.updatePlayerGrid(playerUsername, req.body.grid);
      await match.setPlayerReady(playerUsername);

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
