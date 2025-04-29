import mongoose from 'mongoose';
import type { UserModelType } from './model/user.model';

//
import { hashPassword, verifyPassword } from '../../utils/password.utils';
import { IUserService, IUser, UserRole, ICount, IUserResponse, IParseFile, IPackage } from './type';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../utils/api/apiError';

import type {
  IChangePasswordSchemaType,
  ICreatePackageSchemaType,
  IForgotPasswordSchemaType,
  IRegisterSchemaType,
  IUpdatePackageSchemaType,
  IUpdateProfileSchemaType,
} from './user.validation';

//
import { jwtHelper } from '../../utils/jwt.helper';
import { NotificationModelType } from '../notification/model/notification.model';
import { INotification } from '../notification/type';
import { FeatureImageModelType } from './model/featureImage.model';
import { generateRandomString } from '../../utils/generateString';
import { IResetPasswordType } from '../auth/type';
import { AvailabilityModelType } from '../availability/model/availability.model';
import { ReviewModelType } from '../booking/model/review.model';
import { AvailableStatus } from '../availability/type';
import { BookingModelType } from '../booking/model/booking.model';
import { BookingPaidStatus, BookingStatus } from '../booking/type';
import { PackageModelType } from './model/package.model';

import EmailSendService from '../../utils/email';

const emailService = new EmailSendService();

class UserService implements IUserService {
  private userModel;
  private featureImageModel;
  private notificationModel;
  private availabilityModel;
  private reviewModel;
  private bookingModel;
  private packageModel;
  constructor(
    userModel: UserModelType,
    featureImageModel: FeatureImageModelType,
    notificationModel: NotificationModelType,
    availabilityModel: AvailabilityModelType,
    reviewModel: ReviewModelType,
    bookingModel: BookingModelType,
    packageModel: PackageModelType,
  ) {
    this.userModel = userModel;
    this.featureImageModel = featureImageModel;
    this.notificationModel = notificationModel;
    this.availabilityModel = availabilityModel;
    this.reviewModel = reviewModel;
    this.bookingModel = bookingModel;
    this.packageModel = packageModel;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    //
    return user;
  }

  async getPhotographerDetails(id: string) {
    const photographer = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      role: UserRole.PHOTOGRAPHER,
    });
    if (!photographer) throw new NotFoundError('Photographer not found');

    const packages = await this.packageModel.find({
      photographerId: new mongoose.Types.ObjectId(id),
    });

    //
    const featureImages = await this.featureImageModel
      .find({ photographerId: photographer.id })
      .select('_id imageUrl alt');

    const availabilities = await this.availabilityModel.find({
      photographerId: photographer._id,
      status: AvailableStatus.AVAILABLE,
    });

    const reviews = await this.reviewModel.find({ photographerId: photographer.id }).populate({
      path: 'userId',
      select: '_id firstName lastName',
    });

    return {
      photographer,
      featureImages,
      packages,
      availabilities: availabilities
        .filter((availability) => availability.date >= new Date() && availability.status === AvailableStatus.AVAILABLE)
        .map((availability) => ({
          _id: availability._id,
          date: availability.date,
          status: availability.status,
        })),
      reviews: reviews?.map((review) => ({
        _id: review._id,
        user: review.userId,
        comment: review.comment,
        rating: review.rating,
      })),
    };
  }

  async createUser(data: IRegisterSchemaType): Promise<IUser> {
    const user = await this.userModel.findOne({ email: data.email });

    if (user) {
      throw new BadRequestError('User already exists');
    }

    const newUser = await this.userModel.create({
      ...data,
      password: await hashPassword(data.password),
      role: UserRole.USER,
    });

    //
    return newUser;
  }

  async update(user: IUser, data: IUpdateProfileSchemaType): Promise<void> {
    const userDetails = await this.userModel.findById(String(user._id));
    if (!userDetails) {
      throw new ForbiddenError('User not found');
    }

    //
    await this.userModel.findByIdAndUpdate(user._id, { ...data });
    return;
  }

  async changePassword(
    user: IUser,
    data: IChangePasswordSchemaType,
  ): Promise<{ user: IUserResponse; accessToken: string; refreshToken: string }> {
    const userDetails = await this.userModel.findById(String(user._id));
    if (!userDetails) {
      throw new ForbiddenError('User not found');
    }

    //
    const checkPassword = await verifyPassword(user.password, data.oldPassword);
    if (!checkPassword) {
      throw new ForbiddenError('Invalid password');
    }
    await this.userModel.findByIdAndUpdate(user._id, { password: await hashPassword(data.newPassword) });

    //
    const payload = {
      _id: userDetails._id,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      role: userDetails.role,
    };
    const { accessToken, refreshToken } = await jwtHelper.createJwtToken(payload);

    //
    return {
      user: {
        _id: String(userDetails._id),
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        role: userDetails.role,
        address: userDetails.address,
      },
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(data: IForgotPasswordSchemaType): Promise<void> {
    const user = await this.userModel.findOne({ email: data.email, isDeactivated: false });
    if (!user) throw new NotFoundError('User not found');
    const token = generateRandomString();
    const resetLink = `http://localhost:5173/reset-password?email=${user.email}&token=${token}`;
    user.resetCode = token;
    await user.save();

    // return await sendPasswordResetEmail(user.email, user.firstName, resetLink);
    emailService.sendPasswordResetEmail({
      to: user.email,
      name: user.firstName,
      resetLink,
    });
    return;
  }

  async resetPassword(data: IResetPasswordType): Promise<void> {
    const user = await this.userModel.findOne({ email: data.email, resetCode: data.token, isDeactivated: false });
    if (!user) throw new NotFoundError('User not found');
    await this.userModel.findByIdAndUpdate(user._id, { password: await hashPassword(data.password) });
    user.resetCode = '';
    await user.save();
    return;
  }

  async createPhotographer(data: IRegisterSchemaType): Promise<IUser> {
    const user = await this.userModel.findOne({ email: data.email });
    if (user) {
      throw new BadRequestError('User already exists');
    }

    return await this.userModel.create({
      ...data,
      password: await hashPassword(data.password),
      role: UserRole.PHOTOGRAPHER,
    });
  }

  /**
   * Get Notifications
   */
  async getNotifications(user: IUser): Promise<ICount<INotification>> {
    const count = await this.notificationModel.countDocuments({ userId: user._id });
    const notifications = await this.notificationModel.find({ userId: user._id });

    //
    return {
      data: notifications,
      count,
    };
  }

  /**
   * Get Users
   */
  async getUsers(role: string): Promise<ICount<IUser>> {
    const count = await this.userModel.countDocuments({ role });
    const users = await this.userModel.find({ role }).sort({ createdAt: -1 });

    //
    return {
      data: users,
      count,
    };
  }

  /**
   * Upload Profile
   */
  async uploadProfile(userId: string, data: IParseFile[]): Promise<void> {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user) throw new NotFoundError('User not found');

    user.image = data[0].imageUrl;
    await user.save();
    return;
  }

  /**
   * Upload Feature Image
   */
  async uploadFeatureImage(userId: string, data: IParseFile[]): Promise<void> {
    const user = await this.userModel.findOne({
      _id: userId,
      role: UserRole.PHOTOGRAPHER,
    });
    if (!user) throw new NotFoundError('User not found');

    //
    const uploadPromises = data.map((file) =>
      this.featureImageModel.create({
        photographerId: userId,
        imageUrl: file.imageUrl,
        alt: file.alt,
      }),
    );

    await Promise.all(uploadPromises);
    return;
  }

  async deleteFeatureImage(imageId: string): Promise<void> {
    const image = await this.featureImageModel.findOne({
      _id: new mongoose.Types.ObjectId(imageId),
    });
    if (!image) throw new NotFoundError('Image not found');

    await this.featureImageModel.deleteOne({
      _id: new mongoose.Types.ObjectId(imageId),
    });
    return;
  }

  /**
   * Admin Dashboard
   */
  async adminDashboard() {
    const totalUserCount = await this.userModel.countDocuments({ role: UserRole.USER });
    const totalPhotographerCount = await this.userModel.countDocuments({ role: UserRole.PHOTOGRAPHER });
    const totalBookingCount = await this.bookingModel.countDocuments();
    const totalPendingBookingCount = await this.bookingModel.countDocuments({ status: BookingStatus.REQUESTED });
    const paidBookings = await this.bookingModel.find({ paidStatus: BookingPaidStatus.PAID });
    const totalRevenue = paidBookings.reduce((sum, booking) => sum + booking.amount, 0);

    const latestBooking = await this.bookingModel
      .find()
      .populate({
        path: 'userId',
        select: '_id firstName lastName', // Selecting required fields
      })
      .populate({
        path: 'photographerId',
        select: '_id firstName lastName', // Selecting required fields
      })
      .populate({
        path: 'availabilityId',
        select: '_id date status',
      });

    return {
      totalUserCount,
      totalPhotographerCount,
      totalBookingCount,
      totalPendingBookingCount,
      totalRevenue,
      latestBooking: latestBooking.map((booking) => ({
        _id: booking._id,
        user: booking.userId,
        photographer: booking.photographerId,
        availability: booking.availabilityId,
        status: booking.status,
        paidStatus: booking.paidStatus,
        amount: booking.amount,
      })),
    };
  }

  /**
   * Photographer Dashboard
   */
  async photographerDashboard(photographerId: string) {
    const bookings = await this.bookingModel.find({
      paidStatus: BookingPaidStatus.PAID,
      photographerId: new mongoose.Types.ObjectId(photographerId),
    });
    const totalEarningAmount = bookings.reduce((sum, booking) => sum + booking.amount, 0);

    const bookingCompletedCount = await this.bookingModel.countDocuments({
      status: BookingStatus.COMPLETED,
      photographerId: new mongoose.Types.ObjectId(photographerId),
    });

    const latestBookingRequests = await this.bookingModel
      .find({
        status: BookingStatus.REQUESTED,
        photographerId: new mongoose.Types.ObjectId(photographerId),
      })
      .populate({
        path: 'userId',
        select: '_id firstName lastName image', // Selecting required fields
      })
      .populate({
        path: 'photographerId',
        select: '_id firstName lastName image', // Selecting required fields
      })
      .populate({
        path: 'availabilityId',
        select: '_id date status',
      });

    return {
      totalEarningAmount,
      bookingRequestCount: latestBookingRequests.length ?? 0,
      bookingCompletedCount,
      latestBookingRequests: latestBookingRequests.map((booking) => ({
        _id: booking._id,
        user: booking.userId,
        photographer: booking.photographerId,
        availability: booking.availabilityId,
        status: booking.status,
        paidStatus: booking.paidStatus,
        amount: booking.amount,
      })),
    };
  }

  /**
   * Package
   */
  async getPackage(photographerId: string): Promise<ICount<IPackage>> {
    const photographer = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(photographerId),
      role: UserRole.PHOTOGRAPHER,
    });
    if (!photographer) throw new NotFoundError('Photographer not found');

    const count = await this.packageModel.countDocuments({
      photographerId: new mongoose.Types.ObjectId(photographerId),
    });
    const packages = await this.packageModel
      .find({ photographerId: new mongoose.Types.ObjectId(photographerId) })
      .sort({ createdAt: -1 });

    //
    return {
      data: packages,
      count,
    };
  }

  async createPackage(photographerId: string, data: ICreatePackageSchemaType): Promise<IPackage> {
    const photographer = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(photographerId),
      role: UserRole.PHOTOGRAPHER,
    });
    if (!photographer) throw new NotFoundError('Photographer not found');

    const response = await this.packageModel.create({
      photographerId,
      title: data.title,
      description: data.description,
      price: data.price,
    });

    //
    return response;
  }

  async updatePackage(packageId: string, data: IUpdatePackageSchemaType): Promise<void> {
    const response = await this.packageModel.findOne({
      _id: new mongoose.Types.ObjectId(packageId),
    });
    if (!response) throw new NotFoundError('Package not found');

    //
    await this.packageModel.updateOne(
      { _id: new mongoose.Types.ObjectId(packageId) },
      {
        title: data.title,
        description: data.description,
        price: data.price,
      },
    );
    return;
  }

  async deletePackage(packageId: string): Promise<void> {
    const response = await this.packageModel.findOne({
      _id: new mongoose.Types.ObjectId(packageId),
    });
    if (!response) throw new NotFoundError('Package not found');

    //
    await this.packageModel.deleteOne({ _id: new mongoose.Types.ObjectId(packageId) });
    return;
  }

  /**
   * Deactivate User
   */
  async deactivateUser(photographerId: string): Promise<void> {
    const user = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(photographerId),
      role: UserRole.PHOTOGRAPHER,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isDeactivated) {
      throw new BadRequestError('User already deactivated');
    }

    await this.userModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(photographerId),
      },
      {
        isDeactivated: true,
      },
    );
    return;
  }

  async activateUser(photographerId: string): Promise<void> {
    const user = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(photographerId),
      role: UserRole.PHOTOGRAPHER,
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isDeactivated) {
      throw new BadRequestError('User already activated');
    }

    await this.userModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(photographerId),
      },
      {
        isDeactivated: false,
      },
    );
    return;
  }
}

//
export default UserService;
