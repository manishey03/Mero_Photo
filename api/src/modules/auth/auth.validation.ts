import { object, string, InferType } from 'yup';

export const loginSchema = object({
  email: string().email('Invalid email format').required('Email is required'),
  password: string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
});

export const registerSchema = object({
  firstName: string()
    .min(2, 'Should be at least two character')
    .max(20, 'Can not be greater than 20 character')
    .required('First name is required'),
  lastName: string()
    .min(2, 'Should be at least two character')
    .max(30, 'Can not be greater than 30 character')
    .required('Last name is required'),
  email: string().email('Invalid email format').required('Email is required'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'Password must contain at least one symbol (!@#$%&*(){})'),
});

//
export type ILoginSchemaType = InferType<typeof loginSchema>;
export type IRegisterSchemaType = InferType<typeof registerSchema>;
