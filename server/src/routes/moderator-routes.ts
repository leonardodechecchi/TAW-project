import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { StatusError } from '../models/StatusError';
import { createUser, deleteUserById, getUserById, UserDocument, UserRoles } from '../models/User';
import { formatUser } from '../utils/format-user';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * POST /moderators/:moderatorId/users
 */
router.post(
  '/moderators/:moderatorId/users',
  auth,
  async (req: Request<{ moderatorId: string }>, res, next) => {
    try {
      const moderatorId: Types.ObjectId = retrieveId(req.params.moderatorId);
      const moderator: UserDocument = await getUserById(moderatorId);

      if (moderator.hasRole(UserRoles.Admin) || moderator.hasRole(UserRoles.Moderator)) {
        const randomPwd: string = process.env.TMP_PWD || '';
        const username: string = 'moderator' + Math.floor(Date.now() + Math.random());

        const newModerator: UserDocument = await createUser({ username, password: randomPwd });
        await newModerator.setRole(UserRoles.Moderator);
        return res.status(200).json(formatUser(newModerator));
      }
      return next(new StatusError(401, 'Unauthorized'));
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /moderators/:moderatorId/users/:userId
 */
router.delete(
  '/moderators/:moderatorId/users/:userId',
  auth,
  async (req: Request<{ moderatorId: string; userId: string }>, res, next) => {
    try {
      const moderatorId: Types.ObjectId = retrieveId(req.params.moderatorId);
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const moderator: UserDocument = await getUserById(moderatorId);

      if (moderator.hasRole(UserRoles.Admin) || moderator.hasRole(UserRoles.Moderator)) {
        await deleteUserById(userId);
        return res.sendStatus(200);
      }
      return next(new StatusError(401, 'Unauthorized'));
    } catch (err) {
      next(err);
    }
  }
);

export = router;
