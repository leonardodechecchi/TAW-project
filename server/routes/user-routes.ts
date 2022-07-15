import Router, { Request, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { getUserById, getUserByUsername } from '../models/User';
import { formatUser } from '../utils/format-user';

const router = Router();

/**
 *
 * @param inputId
 * @returns
 */
const retrieveId = (inputId: string) => {
  try {
    return new Types.ObjectId(inputId);
  } catch (err) {
    throw new Error('No user with that identifier');
  }
};

/**
 *
 */
router.get('/users/:userId', auth, async (req: Request<{ userId: string }>, res, next) => {
  try {
    const user = await getUserById(retrieveId(req.params.userId));
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 *
 */
router.get('/users', auth, async (req: Request<{}, {}, {}, { username: string }>, res, next) => {
  try {
    const user = await getUserByUsername(req.query.username);
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

export = router;
