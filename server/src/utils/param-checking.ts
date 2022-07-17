import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { StatusError } from '../models/StatusError';

/**
 * Retrieve the user's id in ObjectId format.
 * @param inputId the id
 * @returns an ObjectId
 */
export const retrieveId = (inputId: string): Types.ObjectId => {
  try {
    return new Types.ObjectId(inputId);
  } catch (err) {
    throw new StatusError(400, 'Invalid id');
  }
};

export const getUserId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: Types.ObjectId = new Types.ObjectId(req.params.userId);
    res.locals.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
};

export const getChatId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const chatId: Types.ObjectId = new Types.ObjectId(req.params.chatId);
    res.locals.chatId = chatId;
    next();
  } catch (err) {
    next(err);
  }
};
