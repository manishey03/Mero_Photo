import type {
  IBookingAcceptedType,
  IBookingRequestType,
  IPaymentSuccessPhotographerType,
  IPaymentSuccessUserType,
  IResetEmail,
} from './types';

/**
 * Reset Password Template
 */
export function resetPasswordTemplate(props: IResetEmail): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 600px;
          margin: 20px;
          padding: 30px;
        }
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        p {
          color: #555;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        .button-container {
          text-align: center;
          margin-bottom: 30px;
        }
        .button {
          background-color: #007bff;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          color: #888;
          font-size: 14px;
          margin-top: 20px;
        }
        .logo {
          display: block;
          margin: 0 auto 20px;
          max-width: 150px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p>Hello ${props.name},</p>
        <p>You have requested a password reset. Please click the button below to reset your password:</p>
        <div class="button-container">
           <a href="${props.resetLink}" class="button" style="color: white; text-decoration: none;">Reset Password</a>
        </div>
        <p>If you did not request a password reset, please ignore this email. Your account security is important to us.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Mero-Photo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * For Booking Request To Photographer
 * @param props
 * @returns
 */
export function bookingRequestTemplate(props: IBookingRequestType): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Request</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 600px;
          margin: 20px;
          padding: 30px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 15px;
        }
        p {
          color: #555;
          line-height: 1.6;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .highlight {
          font-weight: bold;
          color: #007bff;
        }
        .button-container {
          text-align: center;
          margin: 20px 0;
        }
        .button {
          background-color: #007bff;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          color: #888;
          font-size: 14px;
          margin-top: 25px;
        }
        .divider {
          height: 1px;
          background: #ddd;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>New Booking Request 📷</h1>
        <p>Hello <span class="highlight">${props.photographerName}</span>,</p>
        <p>You have received a new booking request from <span class="highlight">${props.userName}</span>!</p>
        <div class="divider"></div>
        <p><strong>📅 Event Date:</strong> ${props.bookingDate}</p>
        <p><strong>📦 Package:</strong> ${props.packageName}</p>
        <div class="divider"></div>
        <p>To review the booking details and respond to the request, please click the button below:</p>
        <div class="button-container">
          <a href="http://localhost:5173" class="button" style="color: white; text-decoration: none;">View Booking Details</a>
        </div>
        <p>Thank you for using <strong>Mero-Photo</strong>. We hope you have a great session!</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Mero-Photo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Booking Accepted Email to User
export function bookingAcceptedTemplate(props: IBookingAcceptedType): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Accepted</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 0; margin: 0; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; max-width: 600px; margin: 20px auto; }
        h1 { color: #333; }
        p { color: #555; font-size: 16px; }
        .highlight { font-weight: bold; color: #007bff; }
        .footer { color: #888; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Booking Has Been Accepted! 🎉</h1>
        <p>Hello <span class="highlight">${props.userName}</span>,</p>
        <p>Your booking with <span class="highlight">${props.photographerName}</span> for the <span class="highlight">${props.packageName}</span> package on <span class="highlight">${props.bookingDate}</span> has been accepted!</p>
        <p>We hope you have a fantastic session. Thank you for choosing Mero-Photo!</p>
        <div class="footer">&copy; ${new Date().getFullYear()} Mero-Photo. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
}

// Payment Success Email to User
export function paymentSuccessUserTemplate(props: IPaymentSuccessUserType): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Success</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 0; margin: 0; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; max-width: 600px; margin: 20px auto; }
        h1 { color: #333; }
        p { color: #555; font-size: 16px; }
        .highlight { font-weight: bold; color: #007bff; }
        .footer { color: #888; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Payment Successful 🎉</h1>
        <p>Hello <span class="highlight">${props.userName}</span>,</p>
        <p>Your payment for the <span class="highlight">${props.packageName}</span> package on <span class="highlight">${props.bookingDate}</span> has been successfully processed.</p>
        <p>Here are your photographer's details:</p>
        <p><strong>📷 Photographer:</strong> ${props.photographerName}</p>
        <p><strong>📧 Email:</strong> ${props.photographerEmail}</p>
        <p><strong>📞 Contact:</strong> ${props.photographerContact}</p>
        <p>Thank you for choosing Mero-Photo!</p>
        <div class="footer">&copy; ${new Date().getFullYear()} Mero-Photo. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
}

// Payment Success Email to Photographer
export function paymentSuccessPhotographerTemplate(props: IPaymentSuccessPhotographerType): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Payment Received</title>
      <style>
        body { font-family: 'Arial', sans-serif; background-color: #f9f9f9; padding: 0; margin: 0; }
        .container { background-color: #ffffff; border-radius: 10px; padding: 30px; text-align: center; max-width: 600px; margin: 20px auto; }
        h1 { color: #333; }
        p { color: #555; font-size: 16px; }
        .highlight { font-weight: bold; color: #007bff; }
        .footer { color: #888; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>New Booking Payment Received 💰</h1>
        <p>Hello <span class="highlight">${props.photographerName}</span>,</p>
        <p>Your client <span class="highlight">${props.userName}</span> has successfully made the payment for the <span class="highlight">${props.packageName}</span> package on <span class="highlight">${props.bookingDate}</span>.</p>
        <p>Get ready to deliver an amazing photography experience!</p>
        <div class="footer">&copy; ${new Date().getFullYear()} Mero-Photo. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
}
