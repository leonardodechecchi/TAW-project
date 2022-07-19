import mongoose from 'mongoose';
import { UserModel, UserRoles, UserStatus } from '../models/User';
import colors from 'colors';

const dbURI: string | undefined = process.env.DATABASE_URI;
const strColor: string = `[${colors.blue('database')}]`;

mongoose.connect(`mongodb://${dbURI}`);

mongoose.connection.on('connected', async () => {
  try {
    // on connection create an admin user if not exists
    let admin = await UserModel.findOne({ username: 'admin' }).exec();
    if (!admin) {
      console.log(`${strColor}: No admin account found. Creating a new one...`);
      admin = new UserModel({
        email: 'admin@battleship.it',
        username: 'admin',
      });
      await admin.setPassword('admin');
      await admin.setRole(UserRoles.Admin);
      await admin.setStatus(UserStatus.Active);
    }

    // on connection create some testing accounts
    const count = await UserModel.countDocuments({ username: { $ne: 'admin' } }).exec();
    if (count === 0) {
      console.log(`${strColor}: No test accounts found. Creating new ones...`);

      // user1
      const user1 = new UserModel({
        email: 'example1@battleship.it',
        username: 'example1',
      });
      await user1.setPassword('example1');
      await user1.setRole(UserRoles.Standard);
      await user1.setStatus(UserStatus.Active);

      // user2
      const user2 = new UserModel({
        email: 'example2@battleship.it',
        username: 'example2',
      });
      await user2.setPassword('example2');
      await user2.setRole(UserRoles.Standard);
      await user2.setStatus(UserStatus.Active);

      // adding relationships for testing purposes
      await admin.addRelationship(user1._id);
      await admin.addRelationship(user2._id);
    }
    console.log(`${strColor}: Mongoose connection open to mongodb://${dbURI}`);
  } catch (err) {
    console.log(err);
    // che facciamo ???
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
