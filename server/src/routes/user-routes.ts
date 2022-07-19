import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { getUserById, getUserByUsername, User, UserDocument } from '../models/User';
import { UserStats } from '../models/UserStats';
import { formatUser } from '../utils/format-user';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /users/:userId
 */
router.get('/users/:userId', auth, async (req: Request<{ userId: string }>, res, next) => {
  try {
    const userId: Types.ObjectId = retrieveId(req.params.userId);
    const user: UserDocument = await getUserById(userId);
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users?username=username
 */
router.get('/users', auth, async (req: Request<{}, {}, {}, { username: string }>, res, next) => {
  try {
    const user: UserDocument = await getUserByUsername(req.query.username);
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /users/:userId/password
 */
router.put(
  '/users/:userId/password',
  auth,
  async (req: Request<{ userId: string }, {}, { password: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const user: UserDocument = await getUserById(userId);
      await user.setPassword(req.body.password);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /users/:userId/stats
 */
router.put(
  '/users/:userId/stats',
  auth,
  async (req: Request<{ userId: string }, {}, { stats: UserStats }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const user: UserDocument = await getUserById(userId);
      await user.updateStats(req.body.stats);
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
