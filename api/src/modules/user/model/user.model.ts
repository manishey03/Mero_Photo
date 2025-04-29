import mongoose, { Model } from 'mongoose';

//
import { IUser, UserRole } from '../type';

const Schema = mongoose.Schema;
const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: UserRole.USER,
    },
    bio: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    featuredImages: [
      {
        type: String,
        alt: String,
      },
    ],
    resetCode: {
      type: String,
      required: false,
    },
    isDeactivated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        delete ret.resetCode;
        return ret;
      },
    },
  },
);

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export type UserModelType = typeof UserModel;
export default UserModel;
