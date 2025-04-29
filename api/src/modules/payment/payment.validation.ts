import { object, number, InferType, string } from 'yup';

export const paymentInitiateSchema = object({
  amount: number().min(1, 'Minimum should be at least 1').max(9999999).required('Amount is required'),
  bookingId: string().min(6).required('Booking ID is required'),
});

//
export type IPaymentInitiateSchemaType = InferType<typeof paymentInitiateSchema>;
