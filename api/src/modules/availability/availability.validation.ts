import { object, string, InferType,  } from 'yup';
import { isBefore, parseISO, startOfDay } from 'date-fns';

import { paginationSchema } from '../../utils/validator';

/**
 * Create Availability Schema
 */
export const createAvailabilitySchema = object({
  date: string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .test('is-future-date', 'Date must be in the future', (value) => {
      return value ? new Date(value) > new Date() : false;
    })
    .required('Date is required'),
});

/**
 * Get Availability Schema
 */
export const getAvailabilitySchema = paginationSchema.shape({
  date: string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in+#+#MM-DD format')
    .optional()
    .test('is-future-date', 'Date must be greater than today', (value) => {
      if (!value) return true;
      const parsedDate = startOfDay(parseISO(value));
      const today = startOfDay(new Date());
      return isBefore(today, parsedDate);
    }),
});

//
export type IGetAvailabilitySchemaType = InferType<typeof getAvailabilitySchema>;
export type ICreateAvailabilitySchemaType = InferType<typeof createAvailabilitySchema>;
