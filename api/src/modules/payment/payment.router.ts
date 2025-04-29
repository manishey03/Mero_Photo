import express from 'express';

//
import { paymentController } from './index';

//
import { auth } from '../../middleware';
import { bodyValidator } from '../../middleware/validator.middleware';

// //
import { paymentInitiateSchema } from './payment.validation';

//
const paymentRouter = express.Router();

//
paymentRouter
  .route('/initiate-payment')
  .post(auth, bodyValidator(paymentInitiateSchema), paymentController.paymentInitiate);

paymentRouter.route('/success').get(paymentController.completePayment);

//
export default paymentRouter;
