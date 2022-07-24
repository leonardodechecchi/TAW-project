import Router, { Request } from 'express';
import { Types } from 'mongoose';
import { auth } from '..';
import { getChatById, deleteChatById, ChatDocument } from '../models/Chat';
import { Message } from '../models/Message';
import { retrieveId } from '../utils/param-checking';

const router = Router();

/**
 * GET /chats/:chatId
 * Return the chat that match chatId.
 */
router.get('/chats/:chatId', auth, async (req: Request<{ chatId: string }>, res, next) => {
  try {
    const chatId: Types.ObjectId = retrieveId(req.params.chatId);
    const chat: ChatDocument = await getChatById(chatId);
    return res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /chats/:chatId
 * Delete a chat and all its content.
 */
router.delete('/chats/:chatId', auth, async (req: Request<{ chatId: string }>, res, next) => {
  try {
    const chatId: Types.ObjectId = retrieveId(req.params.chatId);
    await deleteChatById(chatId);
    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /chats/:chatId/messages
 * Append the message given in the body to the chat.
 */
router.post(
  '/chats/:chatId/messages',
  auth,
  async (
    req: Request<{ chatId: string }, {}, { author: string; content: string; date: string }>,
    res,
    next
  ) => {
    try {
      console.log(req.body);
      const chatId: Types.ObjectId = retrieveId(req.params.chatId);
      const chat: ChatDocument = await getChatById(chatId);
      const { author, content, date } = req.body;

      const message: Message = {
        author,
        content,
        date: new Date(date),
      };
      await chat.addMessage(message);

      // SOCKET

      return res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /chats/:chatId/users
 * Add a user into the chat.
 */
router.post(
  '/chats/:chatId/users',
  auth,
  async (req: Request<{ chatId: string }, {}, { username: string }>, res, next) => {
    try {
      const chatId: Types.ObjectId = retrieveId(req.params.chatId);
      const chat: ChatDocument = await getChatById(chatId);
      await chat.adduser(req.body.username);
      return res.status(200).json(chat);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /chats/:chatId/users?username=username
 * Remove a user from the chat.
 */
router.delete(
  '/chats/:chatId/users',
  auth,
  async (req: Request<{ chatId: string }, {}, {}, { username: string }>, res, next) => {
    try {
      const chatId: Types.ObjectId = retrieveId(req.params.chatId);
      const chat: ChatDocument = await getChatById(chatId);
      await chat.removeUser(req.query.username);
      return res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export = router;
