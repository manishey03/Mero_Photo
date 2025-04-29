import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import type { TransactionModelType } from './model/transaction.model';
import type { BookingModelType } from '../booking/model/booking.model';

//
import type { IUser } from '../auth/type';
import { BookingPaidStatus, BookingStatus } from '../booking/type';
import { ESEWAPaymentStatus, PaymentMethod, PaymentStatus, type IPaymentService } from './type';
import type { IPaymentInitiateSchemaType } from './payment.validation';

//
import { decodeEsewaPaymentInfo } from './helper';
import { BadRequestError, NotFoundError } from '../../utils/api/apiError';

import EsewaPaymentService from './esewa.service';
import BookingService from '../booking/booking.service';
import BookingModel from '../booking/model/booking.model';
import BookingBusiness from '../booking/booking.business';
import UserModel from '../user/model/user.model';
import AvailabilityModel from '../availability/model/availability.model';
import ReviewModel from '../booking/model/review.model';
import NotificationModel from '../notification/model/notification.model';
import PackageModel from '../user/model/package.model';
const esewaPaymentService = new EsewaPaymentService();

const bookingBusiness = new BookingBusiness();

const bookingService = new BookingService(
  BookingModel,
  bookingBusiness,
  UserModel,
  AvailabilityModel,
  ReviewModel,
  NotificationModel,
  PackageModel,
);

class PaymentService implements IPaymentService {
  private bookingModel;
  private transactionModel;

  constructor(bookingModel: BookingModelType, transactionModel: TransactionModelType) {
    this.bookingModel = bookingModel;
    this.transactionModel = transactionModel;
  }

  async paymentInitiate(user: IUser, data: IPaymentInitiateSchemaType): Promise<{ url: string | null }> {
    // eslint-disable-next-line no-useless-catch
    try {
      const booking = await this.bookingModel.findOne({
        _id: new Types.ObjectId(data.bookingId),
        paidStatus: BookingPaidStatus.UNPAID,
      });
      if (!booking) throw new NotFoundError('Booking not found');

      const referenceId = uuidv4();
      await this.transactionModel.create({
        userId: String(user._id),
        photographerId: String(booking.photographerId),
        bookingId: String(booking.id),
        amount: data.amount,
        referenceId,
        paymentMethod: PaymentMethod.ESEWA,
      });

      const response = await esewaPaymentService.esewaPaymentIntegration({
        amount: data.amount,
        transactionId: referenceId,
      });

      //
      return { url: response };
    } catch (error) {
      throw error;
    }
  }

  async completePayment(data: string): Promise<string> {
    const decodePaymentInfo = decodeEsewaPaymentInfo(data);
    const transaction = await this.transactionModel.findOne({ referenceId: decodePaymentInfo?.transaction_uuid });

    if (!transaction) {
      throw new BadRequestError('Payment is not succeed');
    }

    const booking = await this.bookingModel.findOne({
      _id: transaction.bookingId,
      paidStatus: BookingPaidStatus.UNPAID,
    });
    if (!booking) throw new NotFoundError('Booking not found');

    const paymentStatus = decodePaymentInfo?.status;
    const transactionCode = decodePaymentInfo?.transaction_code;
    const paymentInfo = JSON.stringify(decodePaymentInfo);

    let updateStatus: PaymentStatus;
    let htmlResponse: string;

    switch (paymentStatus) {
      case ESEWAPaymentStatus.PENDING:
        updateStatus = PaymentStatus.PENDING;
        htmlResponse = this.generatePaymentPendingHtml();
        break;

      case ESEWAPaymentStatus.COMPLETE:
        updateStatus = PaymentStatus.SUCCESS;
        htmlResponse = this.generatePaymentSuccessHtml();

        booking.paidStatus = BookingPaidStatus.PAID;
        booking.status = BookingStatus.COMPLETED;
        await booking.save();
        await bookingService.sendBookingConfirmNotification(String(booking._id));
        break;

      default:
        updateStatus = PaymentStatus.FAILURE;
        htmlResponse = this.generatePaymentFailureHtml();
        break;
    }

    await this.transactionModel.updateOne(
      { referenceId: decodePaymentInfo?.transaction_uuid },
      { status: updateStatus, transactionCode, paymentInfo },
    );

    //
    return htmlResponse;
  }

  private generatePaymentSuccessHtml(): string {
    return `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Payment Success</title><style>body {font-family: Arial, sans-serif; background-color: #f0f8ff; color: #333; text-align: center; padding-top: 100px;}.container {max-width: 400px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);}h1 {color: #28a745;}.btn {display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;}.btn:hover {background-color: #0056b3;}</style></head><body><div class="container"><h1>Payment Success!</h1><p>Your payment has been processed successfully.</p><a href="http://localhost:5173" class="btn">Go to Homepage</a></div></body></html>
    `;
  }

  private generatePaymentPendingHtml(): string {
    return `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Payment Pending</title><style>body {font-family: Arial, sans-serif; background-color: #f0f8ff; color: #333; text-align: center; padding-top: 100px;}.container {max-width: 400px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);}h1 {color: #ffa500;}.btn {display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;}.btn:hover {background-color: #0056b3;}</style></head><body><div class="container"><h1>Payment Pending!</h1><p>Your payment is currently pending. Please check back later.</p><a href="http://localhost:5173" class="btn">Go to Homepage</a></div></body></html>
    `;
  }

  private generatePaymentFailureHtml(): string {
    return `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Payment Failed</title><style>body {font-family: Arial, sans-serif; background-color: #f0f8ff; color: #333; text-align: center; padding-top: 100px;}.container {max-width: 400px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);}h1 {color: #dc3545;}.btn {display: inline-block; margin-top: 20px; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;}.btn:hover {background-color: #0056b3;}</style></head><body><div class="container"><h1>Payment Failed!</h1><p>Your payment has failed. Please try again.</p><a href="http://localhost:5173" class="btn">Go to Homepage</a></div></body></html>
    `;
  }
}
export default PaymentService;
