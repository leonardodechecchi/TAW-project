import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { NotificationType } from '../models/Notification';
import { getUserById, getUserNotifications, UserDocument, UserNotifications } from '../models/User';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /users/:userId/notifications
 */
router.get(
  '/users/:userId/notifications',
  auth,
  async (req: Request<{ userId: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const notifications: UserNotifications = await getUserNotifications(userId);
      return res.status(200).json(notifications);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /users/:userId/notifications
 */
router.post(
  '/users/:userId/notifications',
  auth,
  async (req: Request<{ userId: string }, {}, { senderId: string; type: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const senderId: Types.ObjectId = retrieveId(req.body.senderId);
      const type: NotificationType =
        NotificationType[req.body.type as keyof typeof NotificationType];

      const user: UserDocument = await getUserById(userId);
      await user.addNotification(senderId, type);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /users/:userId/notifications?senderId=senderId&type=type
 */
router.delete(
  '/users/:userId/notifications',
  auth,
  async (
    req: Request<{ userId: string }, {}, {}, { senderId: string; type: string }>,
    res,
    next
  ) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const senderId: Types.ObjectId = retrieveId(req.query.senderId);
      const type: NotificationType =
        NotificationType[req.query.type as keyof typeof NotificationType];

      const user: UserDocument = await getUserById(userId);
      await user.deleteNotification(senderId, type);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
