import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth, ioServer } from '..';
import { StatusError } from '../models/StatusError';
import {
  createRelationshipChat,
  getUserById,
  getUserRelationships,
  UserDocument,
  UserRelationships,
} from '../models/User';
import { FriendRequestAcceptedEmitter } from '../socket/emitters/FriendRequestAccepted';
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

      const friendRequestAcceptedEmitter = new FriendRequestAcceptedEmitter(
        ioServer,
        req.body.friendId
      );
      friendRequestAcceptedEmitter.emit({
        friendId: {
          _id: user._id.toString(),
          username: user.username,
          online: user.online,
          stats: user.stats,
        },
      });

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

      // check if the relationship exists
      let relationshipFound: boolean = false;
      for (let relationship of user.relationships) {
        if (relationship.friendId.equals(friendId)) relationshipFound = true;
      }

      if (relationshipFound) {
        await createRelationshipChat(user, friend);
      } else return next(new StatusError(401, 'Unauthorized'));

      const relationships: UserRelationships = await getUserRelationships(userId);
      return res.status(200).json(relationships);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
