import { Request, Response, NextFunction } from 'express';

import { paymentService } from './index';
import type { IUser } from './../auth/type';

//
// import ApiResponse from '../../utils/api/apiResponse';

//
import type { IPaymentInitiateSchemaType } from './payment.validation';

/**
 * Payment Controller
 */
class PaymentController {
  async paymentInitiate(req: Request<unknown, unknown, IPaymentInitiateSchemaType>, res: Response, next: NextFunction) {
    try {
      const response = await paymentService.paymentInitiate(req.user as IUser, req.body);

      //
      res.send(response);
    } catch (err) {
      next(err);
    }
  }

  async completePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await paymentService.completePayment(req?.query?.data as string);

      //
      res.send(response);
    } catch (err) {
      next(err);
    }
  }
}

//
export default PaymentController;
