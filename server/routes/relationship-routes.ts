import Router, { Request } from 'express';
import { auth } from '..';
import { getUserById, getUserRelationships } from '../models/User';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /users/:userId/relationships
 */
router.get(
  '/users/:userId/relationships',
  auth,
  async (req: Request<{ userId: string }>, res, next) => {
    try {
      const userId = retrieveId(req.params.userId);
      const relationships = await getUserRelationships(userId);
      return res.status(200).json(relationships);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /users/:userId/relationships
 */
router.post(
  '/users/:userId/relationships',
  auth,
  async (req: Request<{ userId: string }, {}, { friendId: string }>, res, next) => {
    try {
      const userId = retrieveId(req.params.userId);
      const friendId = retrieveId(req.body.friendId);

      const user = await getUserById(userId);
      await user.addRelationship(friendId);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /users/:userId/relationship/
 */
router.delete(
  '/users/:userId/relationships/:friendId',
  auth,
  async (req: Request<{ userId: string; friendId: string }>, res, next) => {
    try {
      const userId = retrieveId(req.params.userId);
      const friendId = retrieveId(req.params.friendId);

      const user = await getUserById(userId);
      await user.deleteRelationship(friendId);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
