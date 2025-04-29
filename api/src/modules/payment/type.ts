import mongoose from 'mongoose';

import type { IUser } from '../auth/type';
import type { IPaymentInitiateSchemaType } from './payment.validation';

export enum PaymentMethod {
  ESEWA = 'esewa',
  KHALTI = 'khalti',
}

export enum PaymentStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PENDING = 'pending',
}

export enum ESEWAPaymentStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  'FULL_REFUND' = 'FULL_REFUND',
  'PARTIAL_REFUND' = 'PARTIAL_REFUND',
  AMBIGUOUS = 'AMBIGUOUS',
  NOT_FOUND = 'NOT_FOUND',
  CANCELED = 'CANCELED',
}

export interface ITransaction {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  photographerId: mongoose.Types.ObjectId;
  referenceId: string;
  transactionCode: string;
  amount: number;
  paymentInfo: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export interface IPaymentService {
  paymentInitiate(user: IUser, data: IPaymentInitiateSchemaType): Promise<{ url: string | null }>;
  completePayment(data: string): Promise<string>;
}
