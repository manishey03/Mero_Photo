import mongoose from 'mongoose';
import { IUser } from '../modules/auth/type';
import { UserRole } from '../modules/user/type';

export interface IPayload {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
declare global {
  namespace Express {
    export interface Request {
      payload: IPayload;
      user: IUser;
    }
  }
}
