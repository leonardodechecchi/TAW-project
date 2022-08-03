import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth, storage } from '..';
import { StatusError } from '../models/StatusError';
import { getUserById, getUserByUsername, UserDocument } from '../models/User';
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
 * PUT /users/:userId/username
 */
router.put(
  '/users/:userId/username',
  async (req: Request<{ userId: string }, {}, { username: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const user: UserDocument = await getUserById(userId);

      await user.setUsername(req.body.username);
      return res.status(200).json(formatUser(user));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /users/:userId/password
 */
router.put(
  '/users/:userId/password',
  auth,
  async (
    req: Request<{ userId: string }, {}, { currentPassword: string; password: string }>,
    res,
    next
  ) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const user: UserDocument = await getUserById(userId);

      const validatePassword = await user.validatePassword(req.body.currentPassword);
      if (validatePassword) {
        await user.setPassword(req.body.password);
        return res.status(200).json(formatUser(user));
      }
      return next(new StatusError(401, 'Wrong password'));
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
      return res.status(200).json(formatUser(user));
    } catch (err) {
      next(err);
    }
  }
);

/**
 *
 */
router.put('/users/:userId/picture', storage, async (req, res, next) => {
  try {
    const userId: Types.ObjectId = retrieveId(req.params.userId);
    const imagePath = 'http://localhost:8000/images/' + req.file?.filename;

    const user: UserDocument = await getUserById(userId);
    await user.updateProfilePicture(imagePath);

    return res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

export = router;
