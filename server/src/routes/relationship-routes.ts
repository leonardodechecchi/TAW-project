import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { ChatDocument } from '../models/Chat';
import {
  createRelationshipChat,
  getUserById,
  getUserRelationships,
  UserDocument,
  UserRelationships,
} from '../models/User';
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
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const relationships: UserRelationships = await getUserRelationships(userId);
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
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const friendId: Types.ObjectId = retrieveId(req.body.friendId);

      const user: UserDocument = await getUserById(userId);
      await user.addRelationship(friendId);

      const relationships: UserRelationships = await getUserRelationships(userId);
      return res.status(200).json(relationships);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /users/:userId/relationships/:friendId
 */
router.delete(
  '/users/:userId/relationships/:friendId',
  auth,
  async (req: Request<{ userId: string; friendId: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const friendId: Types.ObjectId = retrieveId(req.params.friendId);

      const user: UserDocument = await getUserById(userId);
      await user.deleteRelationship(friendId);

      const relationships: UserRelationships = await getUserRelationships(userId);
      return res.status(200).json(relationships);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /users/:userId/relationships/chat
 */
router.post(
  '/users/:userId/relationships/chat',
  auth,
  async (req: Request<{ userId: string }, {}, { friendId: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const friendId: Types.ObjectId = retrieveId(req.body.friendId);

      const user: UserDocument = await getUserById(userId);
      const friend: UserDocument = await getUserById(friendId);

      await createRelationshipChat(user, friend);

      const relationships: UserRelationships = await getUserRelationships(userId);
      return res.status(200).json(relationships);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * // TODO
 * DELETE /users/:userId/relationships/chat/:chatId
 */
router.delete('/users/:userId/relationships/chat/:chatId', auth, async (req, res, next) => {
  try {
    throw new Error('Not implemented');
  } catch (err) {
    next(err);
  }
});

export = router;
