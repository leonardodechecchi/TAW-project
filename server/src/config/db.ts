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
        name: 'Leonardo',
        surname: 'De Checchi',
        email: 'leonardo-dechecchi@battleship.it',
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
        name: 'Mario',
        surname: 'Rossi',
        email: 'mario-rossi@battleship.it',
        username: 'mario-rossi',
        password: 'mario-rossi',
      });
      await user1.setStatus(UserStatus.Active);

      // user2
      const user2: UserDocument = await createUser({
        name: 'Laura',
        surname: 'Villa',
        email: 'laura-villa@battleship.it',
        username: 'laura-villa',
        password: 'laura-villa',
      });
      await user2.setStatus(UserStatus.Active);

      // adding relationshis for testing purpose
      await user1.addRelationship(user2._id);

      // user3 - moderator account
      const user3: UserDocument = await createUser({
        name: 'Roberto',
        surname: 'Riva',
        email: 'roberto-riva@battleship.it',
        username: 'roberto-riva',
        password: 'roberto-riva',
      });
      await user3.setRole(UserRoles.Moderator);
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
