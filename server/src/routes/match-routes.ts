import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth, ioServer } from '..';
import { Grid } from '../models/Grid';
import { GridCoordinates } from '../models/GridCoordinates';
import { Player } from '../models/Player';
import { createMatch, getActiveMatches, getMatchById, MatchDocument } from '../models/Match';
import { PlayerStateChangedEmitter } from '../socket/emitters/PlayerStateChanged';
import { PositioningCompletedEmitter } from '../socket/emitters/PositioningCompleted';
import { retrieveId } from '../utils/param-checking';
import { ShotFiredEmitter } from '../socket/emitters/ShotFired';
import { deleteChatById } from '../models/Chat';

const router = Router();

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
 * GET /matches
 */
router.get('/matches', auth, async (req, res, next) => {
  try {
    const activeMatches: MatchDocument[] = await getActiveMatches();
    console.log(activeMatches);
    return res.status(200).json(activeMatches);
  } catch (err) {
    next(err);
  }
});

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
 * DELETE /mathes/:matchId
 */
router.delete('/mathes/:matchId', auth, async (req: Request<{ matchId: string }>, res, next) => {
  try {
    const matchId: Types.ObjectId = retrieveId(req.params.matchId);
    const match: MatchDocument = await getMatchById(matchId);

    await deleteChatById(match.playersChat);
    await deleteChatById(match.observersChat);

    return res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

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

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /matches/:matchId/players/:playerUsername/ready
 */
router.put(
  '/matches/:matchId/players/:playerUsername/ready',
  auth,
  async (
    req: Request<{ matchId: string; playerUsername: string }, {}, { isReady: boolean }>,
    res,
    next
  ) => {
    try {
      const matchId: Types.ObjectId = retrieveId(req.params.matchId);
      const playerUsername: string = req.params.playerUsername;

      const match: MatchDocument = await getMatchById(matchId);
      await match.setPlayerReady(playerUsername, req.body.isReady);

      match.player1.ready && match.player2.ready
        ? new PositioningCompletedEmitter(ioServer, match._id.toString()).emit({
            message: 'Positioning phase completed!',
          })
        : new PlayerStateChangedEmitter(ioServer, match._id.toString()).emit({
            message: 'The opponent is ready to play!',
          });

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /matches/:matchId/players/:shooterUsername/shot
 */
router.put(
  '/matches/:matchId/players/:shooterUsername/shot',
  auth,
  async (
    req: Request<
      { matchId: string; shooterUsername: string },
      {},
      { coordinates: GridCoordinates }
    >,
    res,
    next
  ) => {
    try {
      const matchId: Types.ObjectId = retrieveId(req.params.matchId);
      const shooterUsername: string = req.params.shooterUsername;
      const coordinates: GridCoordinates = req.body.coordinates;

      const match: MatchDocument = await getMatchById(matchId);
      const opponentPlayer: Player =
        match.player1.playerUsername === shooterUsername ? match.player2 : match.player1;

      await match.addShot(opponentPlayer.playerUsername, coordinates);
      const shotFiredEmitter = new ShotFiredEmitter(ioServer, match._id.toString());
      shotFiredEmitter.emit({ coordinates, shooterUsername });

      await match.setTurnOf(opponentPlayer.playerUsername);

      return res.status(200).json(match);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
