import express from 'express';

//
import { bookingController } from './index';

//
import { auth, roleMiddleware } from '../../middleware';
import { bodyValidator, paramsValidator, queryValidator } from '../../middleware/validator.middleware';

//
import { paramIdSchema } from '../../utils/validator';
import { createBookingSchema, createReviewSchema, getBookingSchema } from './booking.validation';

//
const bookingRouter = express.Router();

bookingRouter
  .route('/photographer') 
  .get(
    auth,
    roleMiddleware.checkPhotographer,
    queryValidator(getBookingSchema),
    bookingController.getPhotographerBookings,
  );

bookingRouter.route('/request').get(auth, queryValidator(getBookingSchema), bookingController.getBookingRequest);

//
bookingRouter
  .route('/')
  .post(auth, roleMiddleware.checkUser, bodyValidator(createBookingSchema), bookingController.create);

bookingRouter.route('/').get(auth, queryValidator(getBookingSchema), bookingController.getBookings);

bookingRouter.route('/:id').get(auth, bookingController.getBookingDetails);

bookingRouter
  .route('/accept/:id')
  .post(auth, roleMiddleware.checkPhotographer, paramsValidator(paramIdSchema), bookingController.accept);

bookingRouter
  .route('/reject/:id')
  .post(auth, roleMiddleware.checkPhotographer, paramsValidator(paramIdSchema), bookingController.decline);

bookingRouter
  .route('/review/:id')
  .post(
    auth,
    roleMiddleware.checkUser,
    paramsValidator(paramIdSchema),
    bodyValidator(createReviewSchema),
    bookingController.review,
  );

//
export default bookingRouter;
