import axios from 'axios';
import crypto from 'node:crypto';
import express from 'express';

//
import userRouter from './modules/user/user.router';
import authRouter from './modules/auth/auth.router';
import paymentRouter from './modules/payment/payment.router';
import availabilityRouter from './modules/availability/availability.router';
import bookingRouter from './modules/booking/booking.router';

//
const appRouter = express.Router();

//
appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter);
appRouter.use('/booking', bookingRouter);
appRouter.use('/payment', paymentRouter);
appRouter.use('/availability', availabilityRouter);

/**
 * Generates a Base64-encoded HMAC SHA256 hash.
 *
 * @param {string} data - The data to be hashed.
 * @param {string} secret - The secret key used for hashing.
 * @returns {string} The Base64-encoded HMAC SHA256 hash.
 */
function generateHmacSha256Hash(data: string, secret: string): string {
  if (!data || !secret) {
    throw new Error('Both data and secret are required to generate a hash.');
  }

  // Create HMAC SHA256 hash and encode it in Base64
  const hash = crypto.createHmac('sha256', secret).update(data).digest('base64');

  return hash;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeStringify(obj: any) {
  const cache = new Set();
  const jsonString = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return; // Discard circular reference
      }
      cache.add(value);
    }
    return value;
  });
  return jsonString;
}

// eSewa Configuration //Later we will serve it from .env
const esewaConfig = {
  merchantId: 'EPAYTEST', // Replace with your eSewa Merchant ID
  successUrl: 'http://localhost:3000/api/payment-success', //Replace with front-end success route page
  failureUrl: 'http://localhost:3000/api/payment-failure', //Replace with front-end failure route page
  esewaPaymentUrl: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  secret: '8gBm/:&EnhH.1/q',
};
// Route to initiate payment
appRouter.post('/initiate-payment', async (req, res) => {
  console.log(req.body, 'check body');
  const paymentData = {
    amount: 500,
    failure_url: esewaConfig.failureUrl,
    product_delivery_charge: '0',
    product_service_charge: '0',
    product_code: esewaConfig.merchantId,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    success_url: esewaConfig.successUrl,
    tax_amount: '0',
    total_amount: 500,
    transaction_uuid: Date.now(),
  };

  console.log('11');
  const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;

  const signature = generateHmacSha256Hash(data, esewaConfig.secret);

  try {
    const payment = await axios.post(esewaConfig.esewaPaymentUrl, null, {
      params: { ...paymentData, signature },
    });
    const reqPayment = JSON.parse(safeStringify(payment));
    if (reqPayment.status === 200) {
      return res.send({
        url: reqPayment.request.res.responseUrl,
      });
    }
  } catch (error) {
    console.log(error, 'error');
    res.send(error);
  }
});

appRouter.get('/payment-success', async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Success</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f0f8ff;
          color: #333;
          text-align: center;
          padding-top: 100px;
        }
        .container {
          max-width: 400px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #28a745;
        }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Payment Success!</h1>
        <p>Your payment has been processed successfully.</p>
        <a href="http://localhost:5173" class="btn">Go to Homepage</a>
      </div>
    </body>
    </html>
  `);
});

/**
 * 404: not found
 */
appRouter.get('*', (_req, res) => {
  return res.status(404).json({
    success: false,
    message: "This route doesn't exist on server",
  });
});

//
export default appRouter;
