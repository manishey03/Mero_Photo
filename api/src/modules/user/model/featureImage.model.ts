import mongoose, { Model } from 'mongoose';

//
import { IFeatureImage } from '../type';

const Schema = mongoose.Schema;
const FeatureImageSchema = new Schema<IFeatureImage>(
  {
    photographerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const FeatureImageModel: Model<IFeatureImage> = mongoose.model<IFeatureImage>('FeatureImage', FeatureImageSchema);
export type FeatureImageModelType = typeof FeatureImageModel;
export default FeatureImageModel;
