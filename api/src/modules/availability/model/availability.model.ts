import mongoose, { Model } from 'mongoose';

//
import { AvailableStatus, IAvailability } from '../type';

const Schema = mongoose.Schema;
const AvailabilitySchema = new Schema<IAvailability>(
  {
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, default: AvailableStatus.AVAILABLE },
  },
  { timestamps: true },
);

const AvailabilityModel: Model<IAvailability> = mongoose.model<IAvailability>('Availability', AvailabilitySchema);
export type AvailabilityModelType = typeof AvailabilityModel;
export default AvailabilityModel;
