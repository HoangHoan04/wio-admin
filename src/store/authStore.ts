import type { LoginReq, UserLogInResponseDto, UserSessionDto } from "@/dto/auth.dto";
import { authService } from "@/services/auth.service";
import { tokenCache } from "@/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function unwrapLogin(res: UserLogInResponseDto | { data?: UserLogInResponseDto }) {
  const nested = (res as { data?: UserLogInResponseDto }).data;
  const payload = nested?.accessToken ? nested : (res as UserLogInResponseDto);
  return {
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
}

/* ============================================================
 * STATE
 * ============================================================ */
interface AuthState {
  user: UserSessionDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  /* Actions */
  login: (data: LoginReq) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: UserSessionDto | null) => void;
}

/* ============================================================
 * STORE
 * ============================================================ */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      /* ----------------- LOGIN ----------------- */
      login: async (data) => {
        const res = await authService.login(data);
        const payload = unwrapLogin(res);
        if (!payload.accessToken) {
          throw new Error("Đăng nhập thất bại. Không nhận được token.");
        }
        tokenCache.setAuthData(
          payload.accessToken,
          payload.refreshToken,
          payload.user,
        );
        set({
          user: payload.user,
          accessToken: payload.accessToken,
          refreshToken: payload.refreshToken,
          isAuthenticated: true,
        });
      },

      /* ----------------- LOGOUT ----------------- */
      logout: async () => {
        try {
          const refreshToken = get().refreshToken;
          await authService.logout(refreshToken ? { refreshToken } : undefined);
        } finally {
          tokenCache.clear();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      /* ----------------- REFRESH TOKEN ----------------- */
      refresh: async () => {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const res = await authService.refreshToken({ refreshToken });
        const accessToken = res.accessToken;
        const nextRefresh = res.refreshToken || refreshToken;
        tokenCache.setAuthData(accessToken, nextRefresh, get().user);
        set({
          accessToken,
          refreshToken: nextRefresh,
        });
      },

      /* ----------------- SET USER ----------------- */
      setUser: (user) => set({ user }),
    }),
    {
      name: "invigo-admin-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state.refreshToken) {
          tokenCache.setAuthData(
            state.accessToken,
            state.refreshToken,
            state.user,
          );
        }
      },
    },
  ),
);

/* ============================================================
 * SELECTOR HOOKS
 * ============================================================ */

/**
 * Lấy thông tin user hiện tại
 */
export const useUser = () => useAuthStore((s) => s.user);

/**
 * Kiểm tra đã đăng nhập chưa
 */
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);

/**
 * Lấy access token
 */
export const useAccessToken = () => useAuthStore((s) => s.accessToken);

/**
 * Lấy refresh token
 */
export const useRefreshToken = () => useAuthStore((s) => s.refreshToken);

/**
 * Lấy các action (login, logout, refresh, setUser)
 * Stable reference — không gây re-render không cần thiết
 */
export const useAuthActions = () =>
  useAuthStore((s) => ({
    login: s.login,
    logout: s.logout,
    refresh: s.refresh,
    setUser: s.setUser,
  }));
