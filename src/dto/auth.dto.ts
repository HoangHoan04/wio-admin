import type { BaseDto } from ".";

export interface LoginReq {
  email: string;
  password: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface EmployeeDto {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: any;
}

export interface UserSessionDto {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  role: string;
  isActive?: boolean;
  customer?: any;
}

export interface UserLogInResponseDto {
  user: UserSessionDto;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface UserInfoResponseDto {
  data: UserSessionDto;
  message?: string;
}

export interface UserInfoDto extends BaseDto {
  email: string;
  phone?: string;
  fullName: string;
  isVerified: boolean;
  isAdmin: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  studentId?: string;
  teacherId?: string;
  googleId?: string;
  facebookId?: string;
  zaloId?: string;
}
