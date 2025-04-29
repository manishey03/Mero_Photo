import { parseISO, startOfDay } from 'date-fns';
import { AvailableStatus, IAvailabilityBusiness, IAvailabilityFilter } from './type';
import { IUser } from '../auth/type';
import mongoose from 'mongoose';
import { UserRole } from '../user/type';

export default class AvailabilityBusiness implements IAvailabilityBusiness {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildFilter(user:IUser,query: IAvailabilityFilter): { filter: Record<string, any>; limit: number; page: number } {
    
    const filter = {
      ...(user &&
        user.role === UserRole.PHOTOGRAPHER && {
          photographerId: new mongoose.Types.ObjectId(String(user._id)),
          
        }),
      ...(query.date
        ? {
            date: startOfDay(parseISO(query.date)),
          }
        : {
            date: {
              $gte: new Date(),
            },
          }),
      status: AvailableStatus.AVAILABLE,
    };

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    return { filter, limit, page };
  }
}
