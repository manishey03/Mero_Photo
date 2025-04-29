export interface IResetEmail {
  to: string;
  name: string;
  resetLink: string;
}

export interface IBookingRequestType {
  to: string;
  photographerName: string;
  userName: string;
  bookingDate: string;
  packageName: string;
}

export interface IBookingAcceptedType {
  to: string;
  userName: string;
  photographerName: string;
  packageName: string;
  bookingDate: string;
}

export interface IPaymentSuccessUserType {
  to: string;
  userName: string;
  photographerName: string;
  photographerEmail: string;
  photographerContact: string;
  packageName: string;
  bookingDate: string;
}

export interface IPaymentSuccessPhotographerType {
  to: string;
  photographerName: string;
  userName: string;
  packageName: string;
  bookingDate: string;
}
