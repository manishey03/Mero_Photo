import AvailabilityModel from '../modules/availability/model/availability.model';
import BookingModel from '../modules/booking/model/booking.model';
import { BookingPaidStatus, BookingStatus } from '../modules/booking/type';
import NotificationModel from '../modules/notification/model/notification.model';
import UserModel from '../modules/user/model/user.model';
import PackageModel from '../modules/user/model/package.model';

//
import { UserRole } from '../modules/user/type';
import { hashPassword } from '../utils/password.utils';

/**
 * FOR CREATE ADMIN:
 */
export async function createAdminUser() {
  const isAdminExist = await UserModel.countDocuments({ email: 'admin@gmail.com' });
  const isPhotographerExist = await UserModel.countDocuments({ email: 'photographer@gmail.com' });
  const isUserExist = await UserModel.countDocuments({ email: 'user@gmail.com' });
  if (isAdminExist && isPhotographerExist && isUserExist) return;

  const password = await hashPassword('Pass@123');
  //
  await UserModel.create({
    firstName: 'Manisha',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    password,
    role: UserRole.ADMIN,
  });

  const photographer = await UserModel.create({
    firstName: 'Manisha',
    lastName: 'Photographer',
    email: 'photographer@gmail.com',
    password,
    role: UserRole.PHOTOGRAPHER,
    contact: '9864423595',
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  });

  const user = await UserModel.create({
    firstName: 'Manisha',
    lastName: 'User',
    email: 'user@gmail.com',
    password,
    role: UserRole.USER,
    contact: '9864423595',
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  });

  // const packages = await PackageModel.insertMany([
  //   {
  //     photographerId: String(photographer._id),
  //     title: 'Marriage ceremony package',
  //     description: 'Include whole day package',
  //     price: 10000,
  //   },
  //   {
  //     photographerId: String(photographer._id),
  //     title: 'Barta bandhan package',
  //     description: 'Include whole day package',
  //     price: 6000,
  //   },
  //   {
  //     photographerId: String(photographer._id),
  //     title: 'Birthday celebration package',
  //     description: 'Include whole day package',
  //     price: 4000,
  //   },
  //   {
  //     photographerId: String(photographer._id),
  //     title: 'Reception photo shoot package',
  //     description: 'Include whole day package',
  //     price: 15000,
  //   },
  // ]);

  // //
  // const today = new Date();
  // const availabilitiesDate = [
  //   new Date(today.setDate(today.getDate() - 2)), // Last yesterday (2 days ago)
  //   new Date(today.setDate(today.getDate() + 1)), // Yesterday (1 day ago)
  //   new Date(), // Today
  //   new Date(today.setDate(today.getDate() + 1)), // Tomorrow (1 day ahead)
  //   new Date(today.setDate(today.getDate() + 1)), // Next tomorrow (2 days ahead)
  // ];
  // const dummyAvailabilities = availabilitiesDate.map((date) => ({
  //   date,
  //   photographerId: String(photographer._id),
  // }));
  // const availabilities = await AvailabilityModel.insertMany(dummyAvailabilities);

  // await BookingModel.create({
  //   availabilityId: String(availabilities[2]._id),
  //   photographerId: String(photographer._id),
  //   packageId: String(packages[1]._id),
  //   userId: String(user._id),
  //   amount: packages[1].price,
  //   status: BookingStatus.REQUESTED,
  // });
  // await BookingModel.create({
  //   availabilityId: String(availabilities[3]._id),
  //   photographerId: String(photographer._id),
  //   packageId: String(packages[2]._id),
  //   userId: String(user._id),
  //   amount: packages[2].price,
  //   status: BookingStatus.ACCEPTED,
  // });

  // // PAID
  // await BookingModel.create({
  //   availabilityId: String(availabilities[0]._id),
  //   photographerId: String(photographer._id),
  //   packageId: String(packages[0]._id),
  //   userId: String(user._id),
  //   amount: packages[0].price,
  //   status: BookingStatus.ACCEPTED,
  // });

  // await BookingModel.create({
  //   availabilityId: String(availabilities[1]._id),
  //   photographerId: String(photographer._id),
  //   packageId: String(packages[1]._id),
  //   userId: String(user._id),
  //   amount: packages[1].price,
  //   paidStatus: BookingPaidStatus.PAID,
  //   status: BookingStatus.ACCEPTED,
  // });

  // await NotificationModel.create({
  //   userId: String(user._id),
  //   title: 'New notification user',
  //   isRead: false,
  // });

  // await NotificationModel.create({
  //   userId: String(photographer._id),
  //   title: 'New notification photographer',
  //   isRead: false,
  // });
}
