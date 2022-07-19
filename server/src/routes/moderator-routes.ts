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

      if (moderator.isAdmin() || moderator.isModerator()) {
        const randomPwd: string = process.env.TMP_PWD || '';
        const randomUsername: string = 'moderator' + Math.floor(Date.now() + Math.random());

        const newModerator: UserDocument = await createUser({
          username: randomUsername,
          password: randomPwd,
        });
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
      const userToDelete: UserDocument = await getUserById(userId);

      if (moderator.isAdmin() || moderator.isModerator()) {
        if (userToDelete.isAdmin() || userToDelete.isModerator()) {
          return next(
            new StatusError(401, 'You cannot delete a user with a moderator or admin role')
          );
        }
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