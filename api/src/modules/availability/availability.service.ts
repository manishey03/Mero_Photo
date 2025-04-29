import { startOfDay, parseISO } from 'date-fns';

//
import type { AvailabilityModelType } from './model/availability.model';

//
import { BadRequestError } from '../../utils/api/apiError';

//
import type { ICreateAvailabilitySchemaType, IGetAvailabilitySchemaType } from './availability.validation';

//
import type { IUser } from '../user/type';
import type { IAvailability, IAvailabilityBusiness, IAvailabilityService, ICount } from './type';

/**
 * Availability Service
 */
class AvailabilityService implements IAvailabilityService {
  private availabilityModel;
  private business;

  constructor(availabilityModel: AvailabilityModelType, business: IAvailabilityBusiness) {
    this.availabilityModel = availabilityModel;
    this.business = business;
  }

  async create(user: IUser, data: ICreateAvailabilitySchemaType): Promise<IAvailability> {
    const parsedDate = startOfDay(parseISO(data.date));

    const existingAvailability = await this.availabilityModel.findOne({
      photographerId: String(user._id),
      date: parsedDate,
    });

    if (existingAvailability) {
      throw new BadRequestError('You cannot create multiple availabilities on the same date.');
    }

    //
    return await this.availabilityModel.create({
      photographerId: String(user._id),
      date: parsedDate,
     
    });
  }

  async get(user:IUser,query: IGetAvailabilitySchemaType): Promise<ICount<IAvailability>> {
    const { filter, limit, page } = this.business.buildFilter(user,query);
    const count = await this.availabilityModel.countDocuments(filter);

    //
    const data = await this.availabilityModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ date: 1 });

    return { data, count };
  }
}

export default AvailabilityService;
