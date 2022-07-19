import { Types } from 'mongoose';
import { StatusError } from '../models/StatusError';

/**
 * Create an ObjectId.
 * @param inputId the input id
 * @returns an `ObjectId`
 */
export const retrieveId = (inputId: string): Types.ObjectId => {
  try {
    return new Types.ObjectId(inputId);
  } catch (err) {
    throw new StatusError(400, 'Invalid id');
  }
};
