import Router, { Request } from 'express';
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  UserDocument,
  UserModel,
  UserStatus,
} from '../models/User';
import { StatusError } from '../models/StatusError';
import { issueJwt } from '../utils/issue-jwt';
import { auth, ioServer } from '..';
import { FriendOnlineEmitter } from '../socket/emitters/FriendOnline';
import { FriendOfflineEmitter } from '../socket/emitters/FriendOffline';
import { retrieveId } from '../utils/param-checking';
import { Types } from 'mongoose';
import { EmailTokenDocument, EmailTokenModel } from '../models/EmailToken';
import crypto from 'crypto';
import { sendEmail } from '../config/nodemailer';

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

      // update online status and inform all friends
      await user.setOnlineStatus(true);
      user.relationships.map((relationship) => {
        new FriendOnlineEmitter(ioServer, relationship.friendId.toString()).emit({
          userId: user._id.toString(),
        });
      });

      // create jwt token
      const token = issueJwt(user);
      return res.status(200).json(token);
    } catch (err) {
      next(new StatusError(401, 'Invalid username or password'));
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
    user.relationships.map((relationship) => {
      new FriendOfflineEmitter(ioServer, relationship.friendId.toString()).emit({
        userId: user._id.toString(),
      });
    });

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
    req: Request<
      {},
      {},
      { name: string; surname: string; username: string; email: string; password: string }
    >,
    res,
    next
  ) => {
    try {
      const { name, surname, username, email, password } = req.body;

      const user: UserDocument = await UserModel.findOne({ email }).exec();
      if (user) return next(new StatusError(403, 'User with given email already exists'));

      // create the new user and email token
      const newUser: UserDocument = await createUser({ name, surname, email, username, password });
      const emailToken: EmailTokenDocument = await new EmailTokenModel({
        userId: newUser._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();

      // send email
      const message: string = `Click the <a href="${
        process.env.BASE_ENDPOINT
      }/auth/verify/${newUser._id.toString()}/${
        emailToken.token
      }">link</a> to verify your email address`;

      await sendEmail(newUser.email, 'Verify your email address', message);

      return res
        .status(200)
        .json({ message: 'We sent an email to your account, please verify your email address' });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /auth/verify/:userId/:token
 */
router.get(
  '/auth/verify/:userId/:token',
  async (req: Request<{ userId: string; token: string }>, res, next) => {
    try {
      const userId: Types.ObjectId = retrieveId(req.params.userId);
      const user: UserDocument = await getUserById(userId);
      const token: EmailTokenDocument = await EmailTokenModel.findOneAndDelete({
        userId,
        token: req.params.token,
      }).exec();

      if (!user || !token) return next(new StatusError(401, 'Unauthorized'));

      await user.setStatus(UserStatus.Active);
      return res.status(200).send('Now you can login!');
    } catch (err) {
      next(err);
    }
  }
);

export = router;
