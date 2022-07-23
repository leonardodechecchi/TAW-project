import fs from 'fs';
import path from 'path';
import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { getUserById } from '../models/User';

const pubKey: Buffer = fs.readFileSync(path.join(__dirname, '../../keys', 'jwtRS256.key.pub'));

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: pubKey,
  algorithms: ['RS256'],
};

passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      console.log(payload);
      const user = await getUserById(payload.userId);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);
