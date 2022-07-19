import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { ChatDocument, createChat } from '../models/Chat';
import {
  addChatToRelationship,
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
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /users/:userId/relationship/:friendId
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
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /users/:userId/relationships/:friendId/chats
 */
router.post('/users/:userId/relationships/:friendId/chats', auth, async (req, res, next) => {
  try {
    const userId: Types.ObjectId = retrieveId(req.params.userId);
    const friendId: Types.ObjectId = retrieveId(req.params.friendId);

    const user: UserDocument = await getUserById(userId);
    const friend: UserDocument = await getUserById(friendId);

    const chat: ChatDocument = await createChat([user.username, friend.username]);
    await addChatToRelationship(user, friend._id, chat._id);
    await addChatToRelationship(friend, user._id, chat._id);

    return res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
});

export = router;
