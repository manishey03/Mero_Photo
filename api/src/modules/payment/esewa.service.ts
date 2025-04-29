import axios from 'axios';

//
import { esewaConfig } from './config';
import { generateHmacSha256Hash, safeStringify } from './helper';

export interface IEewaPaymentService {
  esewaPaymentIntegration({ amount, transactionId }: { amount: number; transactionId: string }): Promise<void>;
}

/**
 * Esewa Payment Service
 */
export default class EsewaPaymentService implements IEewaPaymentService {
  async esewaPaymentIntegration({ amount, transactionId }: { amount: number; transactionId: string }) {
    const paymentData = {
      amount: amount,
      failure_url: esewaConfig.failureUrl,
      product_delivery_charge: '0',
      product_service_charge: '0',
      product_code: esewaConfig.merchantId,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      success_url: esewaConfig.successUrl,
      tax_amount: '0',
      total_amount: amount,
      transaction_uuid: transactionId,
    };

    const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;

    const signature = generateHmacSha256Hash(data, esewaConfig.secret);

    // Esewa api
    // eslint-disable-next-line no-useless-catch
    try {
      const payment = await axios.post(esewaConfig.esewaPaymentUrl, null, {
        params: { ...paymentData, signature },
      });
      const reqPayment = JSON.parse(safeStringify(payment));
      if (reqPayment.status === 200) {
        return reqPayment.request.res.responseUrl;
      }
    } catch (error) {
      throw error;
    }
  }
}
