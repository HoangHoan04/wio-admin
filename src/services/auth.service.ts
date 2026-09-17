import type {
  ChangePasswordReq,
  LoginReq,
  LogoutReq,
  RefreshTokenReq,
  RefreshTokenResponseDto,
  UpdatePasswordReq,
  UpdateProfileReq,
  UserInfoResponseDto,
  UserLogInResponseDto,
} from "@/dto/auth.dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const authService = {
  /* ============================================================
   * LOGIN
   * ============================================================ */
  login: async (data: LoginReq): Promise<UserLogInResponseDto> => {
    return rootApiService.post<UserLogInResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
  },

  /* ============================================================
   * REFRESH TOKEN
   * ============================================================ */
  refreshToken: async (
    data: RefreshTokenReq,
  ): Promise<RefreshTokenResponseDto> => {
    return rootApiService.post<RefreshTokenResponseDto>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      data,
    );
  },

  /* ============================================================
   * GET ME
   * ============================================================ */
  getUserInfo: async (): Promise<UserInfoResponseDto> => {
    return rootApiService.post<UserInfoResponseDto>(API_ENDPOINTS.AUTH.ME);
  },

  /* ============================================================
   * LOGOUT
   * ============================================================ */
  logout: async (data?: LogoutReq): Promise<{ message: string }> => {
    return rootApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT,
      data ?? {},
    );
  },

  /* ============================================================
   * PASSWORD
   * ============================================================ */
  changePassword: async (
    data: ChangePasswordReq,
  ): Promise<{ message: string }> => {
    return rootApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data,
    );
  },

  updatePassword: async (
    data: UpdatePasswordReq,
  ): Promise<{ message: string }> => {
    return rootApiService.post<{ message: string }>(
      API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
      data,
    );
  },

  /* ============================================================
   * PROFILE
   * ============================================================ */
  updateProfile: async (
    data: UpdateProfileReq,
  ): Promise<{ message: string; data: UserInfoResponseDto["data"] }> => {
    return rootApiService.post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  /* ============================================================
   * CLEAN TOKENS (Admin only)
   * ============================================================ */
  cleanTokens: async (): Promise<{
    message: string;
    deletedCount: number;
  }> => {
    return rootApiService.post(API_ENDPOINTS.AUTH.CLEAN_TOKENS);
  },
};
