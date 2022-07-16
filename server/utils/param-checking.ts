import { Types } from 'mongoose';

/**
 * Retrieve the user's id in ObjectId format.
 * @param inputId the id
 * @returns an ObjectId
 */
export const retrieveId = (inputId: string): Types.ObjectId => {
  try {
    return new Types.ObjectId(inputId);
  } catch (err) {
    throw new Error('No user with that identifier');
  }
};
