import { InferType, number, object, string } from 'yup';

/**
 * Param ID schema
 */
export const paramIdSchema = object({
  id: string().trim().required('Id is required'),
});

/**
 * Pagination Schema
 */
export const paginationSchema = object({
  limit: number().min(1, 'Limit should be at least 1').max(10, 'Maximum limit can not be greater than 10').optional(),
  page: number()
    .min(1, 'Minimum page should be at least 1')
    .max(999, 'Maximum page can not be greater than 999')
    .optional(),
});

//
export type IParamIdSchema = InferType<typeof paramIdSchema>;
export type IPaginationSchema = InferType<typeof paginationSchema>;
