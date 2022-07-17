import Router, { Request } from 'express';
import { auth } from '..';
import { NotificationType } from '../models/Notification';
import { getUserById, getUserNotifications } from '../models/User';
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
      const userId = retrieveId(req.params.userId);
      const notifications = await getUserNotifications(userId);
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
      const userId = retrieveId(req.params.userId);
      const senderId = retrieveId(req.body.senderId);
      const type = NotificationType[req.body.type as keyof typeof NotificationType];

      const user = await getUserById(userId);
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
      const userId = retrieveId(req.params.userId);
      const senderId = retrieveId(req.query.senderId);
      const type = NotificationType[req.query.type as keyof typeof NotificationType];

      const user = await getUserById(userId);
      await user.deleteNotification(senderId, type);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
