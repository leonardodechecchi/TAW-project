import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { deleteQueueEntry, MatchmakingQueueModel } from '../models/matchmaking/QueueEntry';
import { getUserById, UserDocument } from '../models/User';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * POST matchmaking/queue
 */
router.post(
  'matchmaking/queue',
  auth,
  async (req: Request<{}, {}, { userId: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.body.userId);
      const user: UserDocument = await getUserById(userId);

      await MatchmakingQueueModel.create({
        userId,
        elo: user.stats.elo,
      });

      return res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE matchmaking/queue/:userId
 */
router.delete(
  'matchmaking/queue/:userId',
  auth,
  async (req: Request<{ userId: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.body.userId);
      await deleteQueueEntry(userId);
      return res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
);
