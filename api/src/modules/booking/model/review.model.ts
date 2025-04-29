import mongoose, { Model } from 'mongoose';

//
import { IReview } from '../type';

//
const Schema = mongoose.Schema;
const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 4 },
  },
  { timestamps: true },
);

ReviewSchema.post('save', async function (doc) {
  await mongoose.model('Booking').findByIdAndUpdate(doc.bookingId, {
    review: doc._id,
  });
});

//
const ReviewModel: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);
export type ReviewModelType = typeof ReviewModel;
export default ReviewModel;
