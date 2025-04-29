export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  PHOTOGRAPHER = "photographer",
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
}

export interface IAuthResponse {
  data: {
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
      user: IUser;
    };
  };
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    code?: number;
  };
  message: string;
}
