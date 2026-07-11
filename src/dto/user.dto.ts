import type { BaseDto } from "./common";

export interface IUser extends BaseDto {
  fullName?: string;
  email: string;
  phone?: string;
  customerId?: string;
  isAdmin: boolean;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface ICustomer extends BaseDto {
  userId: string;
  code: string;
  fullName: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  user?: IUser;
}

export interface FilterCustomerDto {
  code?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  gender?: string;
  isDeleted?: boolean;
}

export interface ChangePasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
