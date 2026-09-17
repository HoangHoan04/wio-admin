import type { BaseDto } from "./common";

/* ============================================================
 * USER
 * ============================================================ */
export interface UserDto extends BaseDto {
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  lastLogin?: string | null;
  refreshToken?: string | null;
  customer?: CustomerDto | null;
  fullName?: string | null;
  isAdmin?: boolean;
}

/* ============================================================
 * CUSTOMER
 * ============================================================ */
export interface CustomerDto extends BaseDto {
  userId: string;
  code?: string | null;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  user?: UserDto;
}

/* ============================================================
 * FILTER
 * ============================================================ */
export interface FilterCustomerDto {
  code?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  gender?: string;
  isDeleted?: boolean;
}

/* ============================================================
 * ACTIONS
 * ============================================================ */
export interface ChangeCustomerPasswordDto {
  customerId: string;
  newPassword: string;
}
