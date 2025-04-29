import mongoose, { Model } from 'mongoose';

//
import { BookingPaidStatus, BookingStatus, IBooking } from '../type';

//
const Schema = mongoose.Schema;
const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    availabilityId: { type: Schema.Types.ObjectId, ref: 'Availability', required: true },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    status: { type: String, default: BookingStatus.REQUESTED },
    paidStatus: {
      type: String,
      default: BookingPaidStatus.UNPAID,
    },
    amount: {
      type: Number,
      required: true,
    },
    review: { type: Schema.Types.ObjectId, ref: 'Review' },
  },
  { timestamps: true },
);

//
const BookingModel: Model<IBooking> = mongoose.model<IBooking>('Booking', BookingSchema);
export type BookingModelType = typeof BookingModel;
export default BookingModel;
