/* eslint-disable @typescript-eslint/ban-ts-comment */
import { format } from 'date-fns';
import mongoose from 'mongoose';

//
import BookingBusiness from './booking.business';
import type { BookingModelType } from './model/booking.model';
import { BadRequestError, NotFoundError } from '../../utils/api/apiError';

//
import { BookingStatus } from './type';
import { AvailableStatus } from '../availability/type';

import { UserRole, type IUser } from '../user/type';
import type { IBooking, IBookingService, ICount } from './type';
import type { ICreateBookingSchemaType, ICreateReviewSchemaType, IGetBookingSchemaType } from './booking.validation';

//
import type { ReviewModelType } from './model/review.model';
import type { UserModelType } from '../user/model/user.model';
import type { AvailabilityModelType } from '../availability/model/availability.model';
import type { NotificationModelType } from '../notification/model/notification.model';
import type { PackageModelType } from '../user/model/package.model';

import EmailSendService from '../../utils/email';
const emailService = new EmailSendService();

/**
 * Booking Service
 */
class BookingService implements IBookingService {
  private bookingModel;
  private business;
  private userModel;
  private availabilityModel;
  private reviewModel;
  private notificationModel;
  private packageModel;

  constructor(
    bookingModel: BookingModelType,
    business: BookingBusiness,
    userModel: UserModelType,
    availabilityModel: AvailabilityModelType,
    reviewModeL: ReviewModelType,
    notificationModel: NotificationModelType,
    packageModel: PackageModelType,
  ) {
    this.bookingModel = bookingModel;
    this.business = business;
    this.userModel = userModel;
    this.availabilityModel = availabilityModel;
    this.reviewModel = reviewModeL;
    this.notificationModel = notificationModel;
    this.packageModel = packageModel;
  }

  /**
   * Create booking
   */
  async create(user: IUser, data: ICreateBookingSchemaType): Promise<IBooking> {
    const availability = await this.availabilityModel.findOne({
      _id: new mongoose.Types.ObjectId(data.availabilityId),
      status: AvailableStatus.AVAILABLE,
    });
    if (!availability) {
      throw new BadRequestError('Availability not found');
    }
    const userDetails = await this.userModel.findById(user._id);
    const photographerDetails = await this.userModel.findById(String(availability.photographerId));
    if (!photographerDetails) throw new NotFoundError('Photographer not found');

    // Check user is already send booking request for this availability or not
    const isBookingExist = await this.bookingModel.findOne({
      userId: String(user._id),
      availabilityId: String(data.availabilityId),
    });
    if (isBookingExist) throw new BadRequestError('You have already send this booking request');

    const packageDetail = await this.packageModel.findOne({ _id: new mongoose.Types.ObjectId(data.packageId) });
    if (!packageDetail) throw new NotFoundError('Package not found');

    // Notification send to photographer
    await this.notificationModel.create({
      userId: String(availability.photographerId),
      title: `${userDetails?.firstName} ${userDetails?.lastName} sent you a booking request.`,
    });

    // For Email
    emailService.sendBookingRequestEmail({
      to: photographerDetails.email,
      photographerName: `${photographerDetails.firstName} ${photographerDetails.lastName}`,
      userName: `${userDetails?.firstName} ${userDetails?.lastName}`,
      bookingDate: `${format(availability.date, 'MMMM do yyyy')}`,
      packageName: `${packageDetail.title}`,
    });

    return await this.bookingModel.create({
      userId: user._id,
      photographerId: String(availability.photographerId),
      availabilityId: String(data.availabilityId),
      packageId: String(packageDetail._id),
      status: BookingStatus.REQUESTED,
      amount: packageDetail.price,
    });
  }

  async getBookings(user: IUser, query: IGetBookingSchemaType): Promise<ICount<IBooking>> {
    const { filter, limit, page } = this.business.buildFilter(query, user);
    const count = await this.bookingModel.countDocuments(filter);
    const bookings = await this.bookingModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate({
        path: 'userId',
        model: 'User',
      })
      .populate({
        path: 'photographerId',
        model: 'User',
      })
      .populate({
        path: 'availabilityId',
        model: 'Availability',
      })
      .populate({
        path: 'packageId',
        model: 'Package',
      })
      .populate({
        path: 'review',
        model: 'Review',
      });

    const formattedBookings = bookings?.map((booking) => ({
      _id: booking._id,
      user: booking.userId,
      photographer: booking.photographerId,
      availability: booking.availabilityId,
      package: booking.packageId,
      paidStatus: booking.paidStatus,
      status: booking.status,
      amount: booking.amount,
      review: booking.review
        ? {
            _id: booking.review._id,
            comment: booking.review.comment,
            rating: booking.review.rating,
            user: booking.review.userId,
          }
        : null,
    }));

    // @ts-ignore
    return { data: formattedBookings, count };
  }

  /**
   * Get Booking Request
   */
  async getPhotographerBookings(user: IUser, query: IGetBookingSchemaType): Promise<ICount<IBooking>> {
    const { limit, page } = this.business.buildFilter(query, user);
    const count = await this.bookingModel.countDocuments({
      photographerId: new mongoose.Types.ObjectId(String(user?._id)),
    });
    const bookings = await this.bookingModel
      .find({ photographerId: new mongoose.Types.ObjectId(String(user?._id)) })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'userId',
        model: 'User',
      })
      .populate({
        path: 'photographerId',
        model: 'User',
      })
      .populate({
        path: 'availabilityId',
        model: 'Availability',
      })
      .populate({
        path: 'packageId',
        model: 'Package',
      })
      .populate({
        path: 'review',
        model: 'Review',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'firstName lastName',
        },
      });

    const formattedBookings = bookings?.map((booking) => ({
      _id: booking._id,
      user: booking.userId,
      photographer: booking.photographerId,
      availability: booking.availabilityId,
      package: booking.packageId,
      paidStatus: booking.paidStatus,
      status: booking.status,
      amount: booking.amount,
      review: booking.review ?? null,
    }));

    // @ts-ignore
    return { data: formattedBookings, count };
  }

  /**
   * Get Booking Request
   */
  async getBookingRequest(user: IUser, query: IGetBookingSchemaType): Promise<ICount<IBooking>> {
    const { filter, limit, page } = this.business.buildFilter(query, user);
    const count = await this.bookingModel.countDocuments(filter);
    const bookings = await this.bookingModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'userId',
        model: 'User',
      })
      .populate({
        path: 'availabilityId',
        model: 'Availability',
      })
      .populate({
        path: 'packageId',
        model: 'Package',
      })
      .populate({
        path: 'review',
        model: 'Review',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'firstName lastName',
        },
      })
      .then((bookings) =>
        bookings.map((booking) => ({
          _id: booking?._id,
          status: booking?.status,
          user: booking.userId,
          availability: booking.availabilityId,
          availabilityId: booking.availabilityId._id,
          package: booking.packageId,
          review: booking.review
            ? {
                _id: booking.review._id,
                comment: booking.review.comment,
                rating: booking.review.rating,
                user: booking.review.userId,
              }
            : null,
        })),
      );

    // @ts-ignore
    return { data: bookings, count };
  }

  /**
   * Get Booking Details
   */
  async getBookingDetails(bookingId: string): Promise<IBooking> {
    const response = await this.bookingModel
      .findOne({ _id: bookingId })
      .populate({
        path: 'userId',
        model: 'User',
      })
      .populate({
        path: 'photographerId',
        model: 'User',
      })
      .populate({
        path: 'availabilityId',
        model: 'Availability',
      })
      .populate({
        path: 'packageId',
        model: 'Package',
      })
      .then((booking) => {
        if (!booking) throw new NotFoundError('Booking not found');
        return {
          ...booking.toObject(),
          userId: booking.userId._id,
          user: booking.userId,
          photographerId: booking.photographerId._id,
          photographer: booking.photographerId,
          availabilityId: booking.availabilityId._id,
          availability: booking.availabilityId,
          package: booking.packageId,
        };
      });

    //
    return response;
  }

  /**
   * Accept booking
   */
  async accept(user: IUser, id: string): Promise<void> {
    const booking = await this.bookingModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      status: BookingStatus.REQUESTED,
      photographerId: new mongoose.Types.ObjectId(user._id),
    });

    if (!booking) {
      throw new BadRequestError('Booking not found');
    }

    const photographer = await this.userModel.findById(user._id);
    if (!photographer) {
      throw new NotFoundError('photographer not found');
    }

    const userDetails = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.userId)),
      role: UserRole.USER,
    });
    if (!userDetails) {
      throw new NotFoundError('User not found');
    }

    const packageDetails = await this.packageModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.packageId)),
    });
    if (!packageDetails) {
      throw new NotFoundError('Package not found');
    }

    const availabilityDetails = await this.availabilityModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.availabilityId)),
    });
    if (!availabilityDetails) {
      throw new NotFoundError('Availability not found');
    }

    //
    await this.bookingModel.findByIdAndUpdate(id, { status: BookingStatus.ACCEPTED });
    await this.availabilityModel.findByIdAndUpdate(booking.availabilityId, { status: AvailableStatus.BOOKED });
    await this.notificationModel.create({
      userId: booking.userId,
      title: `${photographer.firstName} ${photographer.lastName} accepted your booking request.`,
    });

    // For Email
    emailService.sendBookingAcceptEmail({
      to: userDetails.email,
      photographerName: `${photographer.firstName} ${photographer.lastName}`,
      userName: `${userDetails?.firstName} ${userDetails?.lastName}`,
      bookingDate: `${format(availabilityDetails.date, 'MMMM do yyyy')}`,
      packageName: `${packageDetails.title}`,
    });
    return;
  }

  /**
   * Decline booking
   */
  async decline(user: IUser, id: string): Promise<void> {
    const booking = await this.bookingModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      status: BookingStatus.REQUESTED,
      photographerId: new mongoose.Types.ObjectId(user._id),
    });

    if (!booking) {
      throw new BadRequestError('Booking not found');
    }

    const photographer = await this.userModel.findById(user._id);
    if (!photographer) {
      throw new NotFoundError('photographer not found');
    }

    await this.bookingModel.findByIdAndUpdate(id, { status: BookingStatus.DECLINED });
    await this.notificationModel.create({
      userId: booking.userId,
      title: `${photographer.firstName} ${photographer.lastName} declined your booking request.`,
    });
    return;
  }

  /**
   * Review Booking
   */
  async review(user: IUser, bookingId: string, data: ICreateReviewSchemaType): Promise<void> {
    const booking = await this.bookingModel.findOne({
      _id: new mongoose.Types.ObjectId(bookingId),
      userId: user._id,
      status: BookingStatus.COMPLETED,
    });

    if (!booking) {
      throw new BadRequestError('Booking not found');
    }

    const isAlreadyExist = await this.reviewModel.countDocuments({
      bookingId: new mongoose.Types.ObjectId(bookingId),
      userId: user._id,
    });

    if (isAlreadyExist) {
      throw new BadRequestError('Only one review can do');
    }

    await this.reviewModel.create({
      photographerId: String(booking.photographerId),
      userId: user._id,
      bookingId,
      comment: data.comment,
      rating: data.rating,
    });
    return;
  }

  /**
   * Booking Confirm Email Notification
   */
  async sendBookingConfirmNotification(bookingId: string) {
    const booking = await this.bookingModel.findOne({
      _id: new mongoose.Types.ObjectId(bookingId),
    });
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    //
    const photographer = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.photographerId)),
      role: UserRole.PHOTOGRAPHER,
    });
    if (!photographer) {
      throw new NotFoundError('photographer not found');
    }

    const userDetails = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.userId)),
      role: UserRole.USER,
    });
    if (!userDetails) {
      throw new NotFoundError('User not found');
    }

    const packageDetails = await this.packageModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.packageId)),
    });
    if (!packageDetails) {
      throw new NotFoundError('Package not found');
    }

    const availabilityDetails = await this.availabilityModel.findOne({
      _id: new mongoose.Types.ObjectId(String(booking.availabilityId)),
    });
    if (!availabilityDetails) {
      throw new NotFoundError('Availability not found');
    }

    // SEND EMAIL TO USER
    emailService.sendPaymentSuccessUserEmail({
      to: userDetails.email,
      userName: `${userDetails.firstName} ${userDetails.lastName}`,
      photographerName: `${photographer.firstName} ${photographer.lastName}`,
      photographerEmail: `${photographer.email}`,
      photographerContact: `${photographer.contact}`,
      packageName: `${packageDetails.title}`,
      bookingDate: `${format(availabilityDetails.date, 'MMMM do yyyy')}`,
    });

    // SEND EMAIL TO PHOTOGRAPHER
    emailService.sendPaymentSuccessPhotographerEmail({
      to: photographer.email,
      userName: `${userDetails.firstName} ${userDetails.lastName}`,
      photographerName: `${photographer.firstName} ${photographer.lastName}`,
      packageName: `${packageDetails.title}`,
      bookingDate: `${format(availabilityDetails.date, 'MMMM do yyyy')}`,
    });
  }
}

export default BookingService;
