import { EHttpHeaders } from "@/common/constants";
import { ROUTES } from "@/common/constants/routes";
import { AUTH_PERSIST_KEY, tokenCache } from "@/utils";
import { API_ENDPOINTS, API_ROUTES } from "./endpoint";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

const handleTimeout = (timeout: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), timeout),
  );

const AUTH_SKIP_URLS = new Set([
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  API_ENDPOINTS.AUTH.LOGOUT,
]);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error || !token) {
      prom.reject(error ?? new Error("Phiên đăng nhập đã hết hạn"));
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const unwrapTokens = (payload: any) => {
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  return {
    accessToken: nested?.accessToken as string | undefined,
    refreshToken: nested?.refreshToken as string | undefined,
  };
};

const expireSession = () => {
  if (tokenCache.isSessionExpired()) {
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== ROUTES.AUTH.LOGIN.path
    ) {
      window.location.replace(ROUTES.AUTH.LOGIN.path);
    }
    return;
  }

  tokenCache.markSessionExpired();
  tokenCache.clear();

  try {
    localStorage.removeItem(AUTH_PERSIST_KEY);
  } catch {
    /* ignore */
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("unauthorized-event"));
    if (window.location.pathname !== ROUTES.AUTH.LOGIN.path) {
      window.location.replace(ROUTES.AUTH.LOGIN.path);
    }
  }
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = tokenCache.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await fetch(
    `${API_ROUTES.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
    {
      method: "POST",
      headers: API_ROUTES.HEADERS,
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!res.ok) {
    throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
  }

  const payload = await res.json().catch(() => ({}));
  const tokens = unwrapTokens(payload);
  if (!tokens.accessToken) {
    throw new Error("Refresh token không trả về access token");
  }

  const nextRefresh = tokens.refreshToken || refreshToken;
  tokenCache.setAuthData(tokens.accessToken, nextRefresh, tokenCache.getUser());

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("token-refreshed", {
        detail: {
          accessToken: tokens.accessToken,
          refreshToken: nextRefresh,
        },
      }),
    );
  }

  return tokens.accessToken;
};

const resolveNewAccessToken = (): Promise<string> => {
  if (tokenCache.isSessionExpired()) {
    return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  return refreshAccessToken()
    .then((token) => {
      processQueue(null, token);
      return token;
    })
    .catch((error) => {
      processQueue(error, null);
      expireSession();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
    });
};

const parseErrorMessage = async (res: Response, fallback: string) => {
  const errorBody = await res.json().catch(async () => {
    const text = await res.text().catch(() => "");
    return { message: text || res.statusText };
  });
  return errorBody?.message || fallback;
};

const request = async <T>(
  url: string,
  method: HttpMethod,
  options: RequestOptions = {},
  didRetry = false,
): Promise<T> => {
  const { headers = {}, body, timeout = API_ROUTES.TIMEOUT } = options;

  if (tokenCache.isSessionExpired() && !AUTH_SKIP_URLS.has(url)) {
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  const token = tokenCache.getAccessToken();
  const authHeaders: Record<string, string> = {};

  if (token) {
    authHeaders[EHttpHeaders.AUTHORIZATION] = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...authHeaders,
    ...headers,
  };

  if (!isFormData) {
    Object.assign(requestHeaders, API_ROUTES.HEADERS);
  }

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (res.status === 401) {
      const skipAuthRecovery = AUTH_SKIP_URLS.has(url);

      if (!skipAuthRecovery && !didRetry && !tokenCache.isSessionExpired()) {
        try {
          await resolveNewAccessToken();
          return request<T>(url, method, options, true);
        } catch {
          throw new Error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          );
        }
      }

      if (!skipAuthRecovery) {
        expireSession();
      }

      throw new Error(
        (await parseErrorMessage(
          res,
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
        )) as string,
      );
    }

    if (!res.ok) {
      throw new Error(
        (await parseErrorMessage(res, res.statusText)) as string,
      );
    }

    return res.json() as Promise<T>;
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

const requestBlob = async (
  url: string,
  method: HttpMethod,
  options: RequestOptions = {},
  didRetry = false,
): Promise<Blob> => {
  const { headers = {}, body, timeout = API_ROUTES.TIMEOUT } = options;

  if (tokenCache.isSessionExpired()) {
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  const token = tokenCache.getAccessToken();
  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders[EHttpHeaders.AUTHORIZATION] = `Bearer ${token}`;
  }

  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...authHeaders,
    ...headers,
  };
  if (!isFormData) {
    Object.assign(requestHeaders, API_ROUTES.HEADERS);
  }

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (res.status === 401) {
      if (!didRetry && !tokenCache.isSessionExpired()) {
        try {
          await resolveNewAccessToken();
          return requestBlob(url, method, options, true);
        } catch {
          throw new Error(
            "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          );
        }
      }
      expireSession();
      throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }
    if (!res.ok) {
      throw new Error(
        (await parseErrorMessage(res, res.statusText)) as string,
      );
    }
    return res.blob();
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

const rootApiService = {
  get: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "GET", { headers }),
  post: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "POST", { body, headers }),
  postBlob: (url: string, body?: any, headers?: Record<string, string>) =>
    requestBlob(url, "POST", { body, headers }),
  put: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "PUT", { body, headers }),
  delete: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "DELETE", { headers }),
};

export default rootApiService;
