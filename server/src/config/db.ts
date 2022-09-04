import mongoose from 'mongoose';
import { createUser, UserDocument, UserModel, UserRoles, UserStatus } from '../models/User';
import colors from 'colors';

const dbURI: string | undefined = process.env.DATABASE_URI;
const strColor: string = `[${colors.blue('database')}]`;

mongoose.connect(`mongodb://${dbURI}`);

mongoose.connection.on('connected', async () => {
  try {
    // on connection create an admin user if not exists
    let admin: UserDocument | null = await UserModel.findOne({ username: 'admin' }).exec();
    if (!admin) {
      console.log(`${strColor}: No admin account found. Creating a new one...`);

      admin = await createUser({
        name: 'admin',
        surname: 'admin',
        email: 'admin@battleship.it',
        username: 'admin',
        password: 'admin',
      });

      await admin.setRole(UserRoles.Admin);
      await admin.setStatus(UserStatus.Active);
    }

    // on connection create some testing accounts
    const count = await UserModel.countDocuments({ username: { $ne: 'admin' } }).exec();
    if (count === 0) {
      console.log(`${strColor}: No test accounts found. Creating new ones...`);

      // user1
      const user1: UserDocument = await createUser({
        name: 'example1',
        surname: 'example1',
        email: 'example1@battleship.it',
        username: 'example1',
        password: 'example1',
      });
      await user1.setStatus(UserStatus.Active);

      // user2
      const user2: UserDocument = await createUser({
        name: 'example2',
        surname: 'example2',
        email: 'example2@battleship.it',
        username: 'example2',
        password: 'example2',
      });
      await user2.setStatus(UserStatus.Active);

      // user3
      const user3: UserDocument = await createUser({
        name: 'example3',
        surname: 'example3',
        email: 'example3@battleship.it',
        username: 'example3',
        password: 'example3',
      });
      await user3.setStatus(UserStatus.Active);

      // adding relationshis for testing purpose
      await user1.addRelationship(user2._id);
      await user1.addRelationship(user3._id);

      // user4 - moderator account
      const user4: UserDocument = await createUser({
        name: 'moderator1',
        surname: 'moderator1',
        email: 'moderator1@battleship.it',
        username: 'moderator1',
        password: 'moderator1',
      });
      await user4.setRole(UserRoles.Moderator);
    }
    console.log(`${strColor}: Mongoose connection open to mongodb://${dbURI}`);
  } catch (err) {
    console.log(err);
  }
});

mongoose.connection.on('error', () => {
  console.log(`${strColor}: Mongoose connection error`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`${strColor}: Mongoose connection disconnected`);
});

// if the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(`${strColor}: Mongoose connection disconnected through app termination`);
    process.exitCode = 0;
  });
});
