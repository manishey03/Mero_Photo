import ReviewModel from './model/review.model';
import BookingModel from './model/booking.model';
import UserModel from '../user/model/user.model';
import AvailabilityModel from '../availability/model/availability.model';
import NotificationModel from '../notification/model/notification.model';
import PackageModel from '../user/model/package.model';

//
import BookingService from './booking.service';
import BookingBusiness from './booking.business';
import BookingController from './booking.controller';

//
const business = new BookingBusiness();
const bookingController = new BookingController();
const bookingService = new BookingService(
  BookingModel,
  business,
  UserModel,
  AvailabilityModel,
  ReviewModel,
  NotificationModel,
  PackageModel,
);

//
export { bookingService, bookingController };
