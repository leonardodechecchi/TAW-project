import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { ChatDocument, getChatById } from '../models/Chat';
import { getUserById, getUserByUsername, UserDocument } from '../models/User';
import { formatUser } from '../utils/format-user';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /users/:userId
 */
router.get('/users/:userId', auth, async (req: Request<{ userId: string }>, res, next) => {
  try {
    const userId = retrieveId(req.params.userId);
    const user = await getUserById(userId);
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users?username=username
 */
router.get('/users', auth, async (req: Request<{}, {}, {}, { username: string }>, res, next) => {
  try {
    const user = await getUserByUsername(req.query.username);
    return res.status(200).json(formatUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /users/:userId/password
 */
router.put(
  '/users/:userId/password',
  auth,
  async (req: Request<{ userId: string }, {}, { password: string }>, res, next) => {
    try {
      const userId = retrieveId(req.params.userId);
      const user = await getUserById(userId);
      await user.setPassword(req.body.password);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /users/:userId/chats
 */
router.get('/users/:userId/chats', auth, async (req, res, next) => {
  try {
    const userId: Types.ObjectId = retrieveId(req.params.userId);
    const user: UserDocument = await getUserById(userId);
    const chats: any = [];
    user.relationships.forEach(async (relationship, idx) => {
      if (relationship.chatId) {
        console.log(relationship.friendId);
        console.log(relationship.chatId);
        const chat = await getChatById(relationship.chatId);
        const username = chat.users.find((username) => username !== user.username);
        const lastMessage = chat.messages[chat.messages.length - 1];
        chats.push({ username, lastMessage });
      }
    });
    return res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
});

export = router;
