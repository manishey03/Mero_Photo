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

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  image: string;
}

export interface AuthResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export interface IApiResponse {
  data: {
    success: boolean;
    message: string;
  };
}

export interface IRegisterResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      featuredImages: string[];
      _id: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
}

export interface IUserListResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface ILoginResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: UserRole;
      };
      accessToken: string;
      refreshToken: string;
    };
  };
}
