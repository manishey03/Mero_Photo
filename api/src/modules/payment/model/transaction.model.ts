import mongoose, { Model } from 'mongoose';

//
import { PaymentMethod, PaymentStatus } from '../type';
import type { ITransaction } from '../type';

//
const Schema = mongoose.Schema;
const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      default: PaymentMethod.ESEWA,
    },
    status: {
      type: String,
      default: PaymentStatus.PENDING,
    },
    transactionCode: {
      type: String,
    },
    paymentInfo: {
      type: String,
    },
  },
  { timestamps: true },
);

//
const TransactionModel: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export type TransactionModelType = typeof TransactionModel;
export default TransactionModel;
