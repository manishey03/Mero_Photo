import mongoose, { Model } from 'mongoose';

//
import { INotification } from '../type';

//
const Schema = mongoose.Schema;
const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  isRead: { type: Boolean, default: false },
});

//
const NotificationModel: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);
export type NotificationModelType = typeof NotificationModel;
export default NotificationModel;
