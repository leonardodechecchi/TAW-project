import fs from 'fs';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/User';

const privKey: Buffer = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key'));

/**
 * Issue a jwt token signed with a private key.
 * @param user the user to get the information from
 * @returns the token
 */
export const issueJwt = (user: User): string => {
  const payload = {
    userId: user._id,
    name: user.name,
    surname: user.surname,
    username: user.username,
    email: user.email,
    status: user.status,
    roles: user.roles,
  };
  return jsonwebtoken.sign(payload, privKey, { expiresIn: '30d', algorithm: 'RS256' });
};
