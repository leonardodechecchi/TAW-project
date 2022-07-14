import Router, { Request } from 'express';
import { createUser, getUserByEmail } from '../models/User';

const router = Router();

router.post(
  '/auth/login',
  async (req: Request<{}, {}, { email: string; password: string }>, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail(email);
      const validate = await user.validatePassword(password);
      if (!validate) return res.status(401).send('Invalid username or password');
      return res.status(200).json({
        /** TODO */
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/auth/register',
  async (
    req: Request<{}, {}, { username: string; email: string; password: string }>,
    res,
    next
  ) => {
    try {
      const { username, email, password } = req.body;
      const user = await createUser(username, email, password);
      return res.status(200).json({
        /** TODO */
      });
    } catch (err) {
      next(err);
    }
  }
);

export = router;
