import TransactionModel from './model/transaction.model';
import BookingModel from '../booking/model/booking.model';

//
import PaymentService from './payment.service';
import PaymentController from './payment.controller';

//
const paymentService = new PaymentService(BookingModel, TransactionModel);
const paymentController = new PaymentController();

export { paymentService, paymentController };
