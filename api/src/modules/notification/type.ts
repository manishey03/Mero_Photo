import mongoose from 'mongoose';

//
export interface INotification {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  isRead: boolean;
}
