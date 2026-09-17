/* ============================================================
 * REQUEST
 * ============================================================ */
export interface LoginReq {
  /** Email hoặc số điện thoại */
  email: string;
  password: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface ChangePasswordReq {
  userId?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePasswordReq {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileReq {
  fullName?: string;
  phone?: string;
  gender?: string;
  /** ISO date string */
  dateOfBirth?: string;
}

export interface LogoutReq {
  refreshToken?: string;
}

/* ============================================================
 * RESPONSE
 * ============================================================ */
export interface UserSessionCustomerDto {
  id: string;
  code?: string | null;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
}

export interface UserSessionDto {
  id: string;
  email: string;
  phone?: string | null;
  role: string;
  isActive?: boolean;
  customer?: UserSessionCustomerDto | null;
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
  data: UserSessionDto & {
    activeSubscription?: SubscriptionSummaryDto | null;
  };
  message?: string;
}

/** Tóm tắt subscription đang hoạt động (trả trong /auth/me) */
export interface SubscriptionSummaryDto {
  id: string;
  planId: string;
  plan?: {
    id: string;
    code: string;
    name: string;
    maxInvitations: number;
    maxGuests: number;
    maxPhotos: number;
    hasAi: boolean;
    hasAnalytics: boolean;
    hasCustomSlug: boolean;
    hasCustomDesign: boolean;
    durationDays: number;
    priceVnd: number;
  };
  status: string;
  startedAt: string;
  expiresAt: string;
}
