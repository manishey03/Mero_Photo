import EmailService from './emailService';
import {
  resetPasswordTemplate,
  bookingRequestTemplate,
  bookingAcceptedTemplate,
  paymentSuccessUserTemplate,
  paymentSuccessPhotographerTemplate,
} from './emailTemplate';

import type {
  IBookingAcceptedType,
  IBookingRequestType,
  IPaymentSuccessPhotographerType,
  IPaymentSuccessUserType,
  IResetEmail,
} from './types';

/**
 * Email Send Service
 */
class EmailSendService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Reset Password
   */
  public async sendPasswordResetEmail(props: IResetEmail): Promise<void> {
    const emailTemplate = resetPasswordTemplate(props);

    return this.emailService.sendEmail({
      to: props.to,
      subject: 'Password Reset Request',
      html: emailTemplate,
    });
  }

  /**
   * Booking Request -> photographer
   */
  public async sendBookingRequestEmail(props: IBookingRequestType): Promise<void> {
    const emailTemplate = bookingRequestTemplate(props);

    return this.emailService.sendEmail({
      to: props.to,
      subject: 'Booking Request Notification',
      html: emailTemplate,
    });
  }

  /**
   * Booking Accept -> user
   */
  public async sendBookingAcceptEmail(props: IBookingAcceptedType): Promise<void> {
    const emailTemplate = bookingAcceptedTemplate(props);

    return this.emailService.sendEmail({
      to: props.to,
      subject: 'Booking Accept Notification',
      html: emailTemplate,
    });
  }

  /**
   * Payment Notification -> user
   */
  public async sendPaymentSuccessUserEmail(props: IPaymentSuccessUserType): Promise<void> {
    const emailTemplate = paymentSuccessUserTemplate(props);

    return this.emailService.sendEmail({
      to: props.to,
      subject: 'Payment Success Notification',
      html: emailTemplate,
    });
  }

  /**
   * Payment Notification -> photographer
   */
  public async sendPaymentSuccessPhotographerEmail(props: IPaymentSuccessPhotographerType): Promise<void> {
    const emailTemplate = paymentSuccessPhotographerTemplate(props);

    return this.emailService.sendEmail({
      to: props.to,
      subject: 'Payment Success Notification',
      html: emailTemplate,
    });
  }
}

export default EmailSendService;
