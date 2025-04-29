import UserModel from './model/user.model';
import ReviewModel from '../booking/model/review.model';
import BookingModel from '../booking/model/booking.model';
import FeatureImageModel from './model/featureImage.model';
import AvailabilityModel from '../availability/model/availability.model';
import NotificationModel from '../notification/model/notification.model';
import PackageModel from './model/package.model';

//
import UserService from './user.service';
import UserController from './user.controller';

const userService = new UserService(
  UserModel,
  FeatureImageModel,
  NotificationModel,
  AvailabilityModel,
  ReviewModel,
  BookingModel,
  PackageModel,
);
const userController = new UserController();

export { userService, userController };
