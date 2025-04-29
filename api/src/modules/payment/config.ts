export const esewaConfig = {
  merchantId: process.env.MERCHANTID ?? 'EPAYTEST',
  successUrl: process.env.PAYMENT_SUCCESS_URL ?? 'http://localhost:3000/api/payment/success',
  failureUrl: process.env.PAYMENT_FAILURE_URL ?? 'http://localhost:3000/api/failure',
  esewaPaymentUrl: process.env.ESEWA_PAYMENT_URL ?? 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  secret: process.env.ESEWA_SECRET ?? '8gBm/:&EnhH.1/q',
};
