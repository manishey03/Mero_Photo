import mongoose from 'mongoose';

//
import type { IUser } from '../user/type';
import type { ICreateBookingSchemaType } from './booking.validation';

export enum BookingStatus {
  REQUESTED = 'Requested',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
  COMPLETED = 'Completed',
}

export enum BookingPaidStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  availabilityId: mongoose.Types.ObjectId;
  status: BookingStatus;
  paidStatus: BookingPaidStatus;
  amount: number;
  review: IReview;
}

export interface IReview {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
}

export type IBookingFilter = {
  status?: BookingStatus;
  limit?: number;
  page?: number;
};

export interface ICount<T> {
  data: T[];
  count: number;
}

export interface IBookingBusiness {
  buildFilter(filters: IBookingFilter, user: IUser): { filter: Record<string, string>; limit: number; page: number };
}

export interface IBookingService {
  create(user: IUser, data: ICreateBookingSchemaType): Promise<IBooking>;
}
