import { object, string, InferType, number } from 'yup';
import { UserRole } from './type';

export const paramIdSchema = object({
  id: string().min(5, 'Minimum should be at least 5 digit').required('Id is required'),
});

export const getUserSchema = object({
  role: string().oneOf(['user', 'photographer']).required('User type is required').default('user'),
});

export const forgotPasswordSchema = object({
  email: string().email('Invalid email format').min(3).max(50).required('Email is required'),
});

export const resetPasswordSchema = object({
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(50)
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'Password must contain at least one symbol (!@#$%&*(){})'),
});

export const loginSchema = object({
  email: string().email('Invalid email format').min(3).max(50).required('Email is required'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(50)
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'Password must contain at least one symbol (!@#$%&*(){})'),
});

export const registerSchema = object({
  firstName: string()
    .min(2, 'Should be at least two character')
    .max(10, 'Can not be greater than 10 character')
    .required('First name is required'),
  lastName: string()
    .min(2, 'Should be at least two character')
    .max(10, 'Can not be greater than 10 character')
    .required('Last name is required'),
  email: string().email('Invalid email format').min(3).max(50).required('Email is required'),
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(50)
    .matches(/[A-Z]/, 'Password must contain at least one capital letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'Password must contain at least one symbol (!@#$%&*(){})'),
  role: string().oneOf(Object.keys(UserRole)).optional(),
});

export const updateProfileSchema = object({
  firstName: string()
    .min(2, 'Should be at least two character')
    .max(100, 'Can not be greater than 100 character')
    .optional(),
  lastName: string()
    .min(2, 'Should be at least two character')
    .max(100, 'Can not be greater than 100 character')
    .optional(),
  bio: string().min(1, 'Bio should be at least one character').max(1000).optional(),
  address: string().min(1, 'Address must be at least one character').max(1000).optional(),
  contact: string()
    .min(10, 'Contact number can not be less than 10 digit')
    .max(10, 'Contact number can not be greater than 10 digit')
    .optional(),
});

export const resetPasswordQuerySchema = object({
  email: string().email('Invalid email format').min(3).max(50).required('Email is required'),
  token: string().min(2, 'Token can not be less than 2 character').trim().required('Token is required'),
});

export const changePasswordSchema = object({
  oldPassword: string()
    .required('Old password is required')
    .min(8, 'Old password must be at least 8 characters long')
    .max(50)
    .matches(/[A-Z]/, 'Old password must contain at least one capital letter')
    .matches(/[0-9]/, 'Old password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'Old password must contain at least one symbol (!@#$%&*(){})'),
  newPassword: string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters long')
    .max(50)
    .matches(/[A-Z]/, 'New password must contain at least one capital letter')
    .matches(/[0-9]/, 'New password must contain at least one number')
    .matches(/[!@#$%&*(){}]/, 'New password must contain at least one symbol (!@#$%&*(){})'),
});

export const createPackage = object({
  title: string()
    .trim()
    .min(2, 'Package name can not be less than 2 character')
    .max(80, 'Package name can not be grater than 80 character')
    .required('Package name is required'),
  description: string()
    .trim()
    .min(2, 'Description can not be less than 2 character')
    .max(999, 'Description can not be greater than 999 character')
    .optional(),
  price: number()
    .positive()
    .min(1, 'Price can not be less than 1')
    .max(99999, 'Price can not be grater than 99999')
    .required('Price is required'),
});

export const updatePackage = object({
  title: string()
    .trim()
    .min(2, 'Package name can not be less than 2 character')
    .max(80, 'Package name can not be grater than 80 character')
    .optional(),
  description: string()
    .trim()
    .min(2, 'Description can not be less than 2 character')
    .max(999, 'Description can not be greater than 999 character')
    .optional(),
  price: number()
    .positive()
    .min(1, 'Price can not be less than 1')
    .max(99999, 'Price can not be grater than 99999')
    .optional(),
});

//
export type IParamSchemaType = InferType<typeof paramIdSchema>;
export type IGetUserSchemaType = InferType<typeof getUserSchema>;

//
export type ILoginSchemaType = InferType<typeof loginSchema>;
export type IChangePasswordSchemaType = InferType<typeof changePasswordSchema>;

export type IForgotPasswordSchemaType = InferType<typeof forgotPasswordSchema>;

export type IResetPasswordQuerySchemaType = InferType<typeof resetPasswordQuerySchema>;
export type IResetPasswordSchemaType = InferType<typeof resetPasswordSchema>;

export type IRegisterSchemaType = InferType<typeof registerSchema>;
export type IUpdateProfileSchemaType = InferType<typeof updateProfileSchema>;

// Package
export type ICreatePackageSchemaType = InferType<typeof createPackage>;
export type IUpdatePackageSchemaType = InferType<typeof updatePackage>;
