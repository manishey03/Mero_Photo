import dotenv from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';

dotenv.config();

/**
 * Email Options Interface
 */
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Email Service Interface
 */
interface IEmailService {
  sendEmail(options: EmailOptions): Promise<void>;
}

/**
 * EmailService Class - Implements Email Sending Service
 */
class EmailService implements IEmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send Email with provided options
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      console.log(`Email sent to ${options.to} successfully`);
    } catch (error) {
      console.error(`Error sending email to ${options.to}:`, error);
    }
  }
}

export default EmailService;
