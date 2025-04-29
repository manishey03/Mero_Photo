import mongoose from 'mongoose';
import { IUser } from '../auth/type';
import { UserRole } from '../user/type';
import type { IBookingBusiness, IBookingFilter } from './type';

export default class BookingBusiness implements IBookingBusiness {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildFilter(query: IBookingFilter, user: IUser): { filter: Record<string, any>; limit: number; page: number } {
    const filter = {
      // FOR PHOTOGRAPHER
      ...(user &&
        user.role === UserRole.PHOTOGRAPHER && {
          photographerId: new mongoose.Types.ObjectId(String(user._id)),
          ...(query?.status && { status: query.status }),
        }),

      // FOR USER
      ...(user &&
        user.role === UserRole.USER && {
          userId: new mongoose.Types.ObjectId(String(user._id)),
          ...(query?.status && { status: query.status }),
        }),

      // FOR ADMIN
      ...(user &&
        user.role === UserRole.ADMIN && {
          ...(query?.status && { status: query.status }),
        }),
    };

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    return { filter, limit, page };
  }
}
