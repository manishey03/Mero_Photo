import express from 'express';

//
import { availabilityController } from './index';
import { auth, roleMiddleware } from '../../middleware';
import { bodyValidator, queryValidator } from '../../middleware/validator.middleware';
import { createAvailabilitySchema, getAvailabilitySchema } from './availability.validation';

//
const availabilityRouter = express.Router();
availabilityRouter.route('/').get(auth, queryValidator(getAvailabilitySchema), availabilityController.get);

availabilityRouter
  .route('/')
  .post(auth, roleMiddleware.checkPhotographer, bodyValidator(createAvailabilitySchema), availabilityController.create);

//
export default availabilityRouter;
