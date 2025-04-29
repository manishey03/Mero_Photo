import mongoose, { Model } from 'mongoose';

//
import { IPackage } from '../type';

const Schema = mongoose.Schema;
const PackageSchema = new Schema<IPackage>(
  {
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const PackageModel: Model<IPackage> = mongoose.model<IPackage>('Package', PackageSchema);
export type PackageModelType = typeof PackageModel;
export default PackageModel;
