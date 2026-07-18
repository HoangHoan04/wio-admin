import { ROUTES } from "@/common/constants/routes";
import type { LoginReq, UserSessionDto } from "@/dto/auth.dto";
import { authService } from "@/services";
import { tokenCache } from "@/utils";
import { create } from "zustand";

const LOGIN_PATH = ROUTES.AUTH.LOGIN.path;
const HOME_PATH = ROUTES.MAIN.HOME.path;

interface AuthState {
  user: UserSessionDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (credentials: LoginReq) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(credentials);
      tokenCache.setAuthData(
        response.accessToken,
        response.refreshToken,
        response.user,
      );
      set({ user: response.user, isAuthenticated: true });
      window.location.href = HOME_PATH;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Lỗi khi gọi API logout:", error);
    } finally {
      tokenCache.clear();
      set({ user: null, isAuthenticated: false });
      window.location.href = LOGIN_PATH;
    }
  },

  refreshUserInfo: async () => {
    try {
      const response = await authService.getUserInfo();
      set({ user: response.data, isAuthenticated: true });
      tokenCache.setUser(response.data);
    } catch {
      get().logout();
    }
  },

  initAuth: async () => {
    const token = tokenCache.getAccessToken();

    if (token) {
      try {
        const response = await authService.getUserInfo();
        set({ user: response.data, isAuthenticated: true });
        tokenCache.setUser(response.data);
      } catch {
        tokenCache.clear();
        set({ user: null, isAuthenticated: false });
        window.location.href = LOGIN_PATH;
      }
    } else {
      set({ isAuthenticated: false });
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }
    set({ isLoading: false });
  },
}));

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((s) => s.isLoading);
