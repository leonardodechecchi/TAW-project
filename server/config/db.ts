import mongoose from 'mongoose';
import { UserModel, UserRoles } from '../models/User';

const dbURI: string | undefined = process.env.DATABASE_URI;

mongoose.connect(`mongodb://${dbURI}`);

mongoose.connection.on('connected', async () => {
  // on connection create an admin user if not exists
  let admin = await UserModel.findOne({ username: 'admin' }).exec();
  if (!admin) {
    console.log(`[database]: No admin account found. Creating a new one...`);
    admin = new UserModel({
      email: 'admin@battleship.it',
      username: 'admin',
    });
    await admin.setPassword('admin');
    await admin.setRole(UserRoles.Admin);
  }
  // on connection create some mock accounts
  const count = await UserModel.countDocuments({ username: { $ne: 'admin' } }).exec();
  if (count === 0) {
    console.log(`[database]: No mock accounts found. Creating new ones...`);
  }
  console.log(`[database]: Mongoose connection open to mongodb://${dbURI}`);
  // user1
  const user1 = new UserModel({
    email: 'example1@battleship.it',
    username: 'example1',
  });
  await user1.setPassword('example1');
  await user1.setRole(UserRoles.Standard);
  // user2
  const user2 = new UserModel({
    email: 'example2@battleship.it',
    username: 'example2',
  });
  await user2.setPassword('example2');
  await user2.setRole(UserRoles.Standard);
});

mongoose.connection.on('error', () => {
  console.log('[database]: Mongoose connection error');
});

mongoose.connection.on('disconnected', () => {
  console.log('[database]: Mongoose connection disconnected');
});

// if the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('[database]: Mongoose connection disconnected through app termination');
    process.exitCode = 0;
  });
});
