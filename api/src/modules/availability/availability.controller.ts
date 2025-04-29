import { Request, Response, NextFunction } from 'express';

//
import { availabilityService } from './index';
import ApiResponse from '../../utils/api/apiResponse';

//
import type { IUser } from '../user/type';
import type { ICreateAvailabilitySchemaType, IGetAvailabilitySchemaType } from './availability.validation';

/**
 * Availability time Controller
 */
class AvailabilityController {
  async get(req: Request<unknown, unknown, unknown, IGetAvailabilitySchemaType>, res: Response, next: NextFunction) {
    try {
      const { data, count } = await availabilityService.get(req.user as IUser,req.query);

      //
      return new ApiResponse(res).addMessage('Availability fetched successfully').addMetadata({ count }).send(data);
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request<unknown, unknown, ICreateAvailabilitySchemaType>, res: Response, next: NextFunction) {
    try {
      const response = await availabilityService.create(req.user as IUser, req.body);

      //
      return new ApiResponse(res).addMessage('Availability time created successfully').send(response);
    } catch (err) {
      next(err);
    }
  }
}

//
export default AvailabilityController;
