import mongoose from 'mongoose';
import {
  IChangePasswordSchemaType,
  ICreatePackageSchemaType,
  IForgotPasswordSchemaType,
  IRegisterSchemaType,
  IUpdateProfileSchemaType,
} from './user.validation';
import { IPayload } from '../../types/global';
import { IResetPasswordType } from '../auth/type';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PHOTOGRAPHER = 'photographer',
}

//
export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  contact: string;
  resetCode: string;
  image: string;
  address?: string;
  isDeactivated?: boolean;
  featuredImages: string[];
}

export interface IFeatureImage {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  imageUrl: string;
  alt: string;
}

export interface IPackage {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
}

export interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  address?: string;
}

export interface ICount<T> {
  data: T[];
  count: number;
}

export interface IParseFile {
  imageUrl: string;
  alt: string;
}

export interface IUserService {
  getUserByEmail(email: string): Promise<IUser>;
  createUser(data: IRegisterSchemaType): Promise<IUser>;
  update(user: IPayload, data: IUpdateProfileSchemaType): Promise<void>;
  changePassword(
    user: IPayload,
    data: IChangePasswordSchemaType,
  ): Promise<{ user: IUserResponse; accessToken: string; refreshToken: string }>;
  createPhotographer(data: IRegisterSchemaType): Promise<IUser>;

  uploadProfile(userId: string, data: IParseFile[]): Promise<void>;
  uploadFeatureImage(userId: string, data: IParseFile[]): Promise<void>;
  forgotPassword(data: IForgotPasswordSchemaType): Promise<void>;
  resetPassword(data: IResetPasswordType): Promise<void>;

  getPackage(photographerId: string): Promise<ICount<IPackage>>;
  createPackage(photographerId: string, data: ICreatePackageSchemaType): Promise<IPackage>;
  deletePackage(packageId: string): Promise<void>;
}
