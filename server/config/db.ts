import mongoose from 'mongoose';

const dbURI: string | undefined = process.env.DATABASE_URI;

mongoose.connect(`mongodb://${dbURI}`);

mongoose.connection.on('connected', () => {
  console.log(`[database]: Mongoose connection open to mongodb://${dbURI}`);
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
