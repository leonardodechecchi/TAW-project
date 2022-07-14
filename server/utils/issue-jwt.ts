import fs from 'fs';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import { User } from '../models/User';

const privKey: Buffer = fs.readFileSync(path.join(__dirname));

/**
 *
 * @param user
 * @returns
 * @memberof utils
 */
export function issueJwt(user: User): string {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
    roles: user.roles,
  };
  return jsonwebtoken.sign(payload, privKey, { expiresIn: '1d', algorithm: 'RS256' });
}
