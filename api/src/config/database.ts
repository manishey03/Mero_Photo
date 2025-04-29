import dotenv from 'dotenv';
import mongoose from 'mongoose';

//
import appConfig from './index';
dotenv.config();

const MONGO_URL = appConfig.mongo_url ?? process.env.MONGO_URL;
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log('DB CONNECT SUCCESSFULLY');
  } catch (err) {
    console.error('DB CONNECTION ERROR:', err);
    process.exit(1);
  }
}

//
connectDB();
