import mongoose from 'mongoose';

//
import type { IUser } from '../user/type';
import type { ICreateAvailabilitySchemaType } from './availability.validation';

export enum AvailableStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
}

export interface IAvailability {
  _id: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  status: AvailableStatus;
  date: Date;
}

export type IAvailabilityFilter = {
  date?: string;
  limit?: number;
  page?: number;
};

export interface ICount<T> {
  data: T[];
  count: number;
}

export interface IAvailabilityBusiness {
  buildFilter(user:IUser,filters: IAvailabilityFilter): { filter: Record<string, string>; limit: number; page: number };
}

export interface IAvailabilityService {
  create(user: IUser, data: ICreateAvailabilitySchemaType): Promise<IAvailability>;
  get(user:IUser,query: IAvailabilityFilter): Promise<ICount<IAvailability>>;
}
