import Router, { Request } from 'express';
import { createUser, getUserByEmail, getUserByUsername, UserDocument } from '../models/User';
import { StatusError } from '../models/StatusError';
import { issueJwt } from '../utils/issue-jwt';
import { auth, ioServer } from '..';
const router = Router();

/**
 * POST /auth/login
 */
router.post(
  '/auth/login',
  async (req: Request<{}, {}, { email: string; password: string }>, res, next) => {
    try {
      const { email, password } = req.body;
      const user: UserDocument = await getUserByEmail(email);

      const validate = await user.validatePassword(password);
      if (!validate) {
        return next(new StatusError(401, 'Invalid username or password'));
      }

      await user.setOnlineStatus(true);

      const token = issueJwt(user);
      return res.status(200).json(token);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /auth/logout
 */
router.put('/auth/logout', auth, async (req: Request<{}, {}, { username: string }>, res, next) => {
  try {
    const user: UserDocument = await getUserByUsername(req.body.username);
    await user.setOnlineStatus(false);

    return res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

/**
 * POST /auth/register
 */
router.post(
  '/auth/register',
  async (
    req: Request<{}, {}, { username: string; email: string; password: string }>,
    res,
    next
  ) => {
    try {
      const { username, email, password } = req.body;
      const user: UserDocument = await createUser({ email, username, password });

      // TODO send email

      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
