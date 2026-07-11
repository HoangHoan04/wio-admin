import { EHttpHeaders } from "@/common/constants";
import { tokenCache } from "@/utils";
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

let isHandlingUnauthorized = false;

const handleUnauthorized = async () => {
  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  try {
    const token = tokenCache.getAccessToken();
    await fetch(`${API_ROUTES.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [EHttpHeaders.AUTHORIZATION]: `Bearer ${token}`,
      },
    });
  } catch {
    console.warn(
      "Đăng xuất không thành công, có thể do mạng hoặc token đã hết hạn",
    );
  } finally {
    isHandlingUnauthorized = false;
    tokenCache.clear();
    window.location.href = "/login";
  }
};

const request = async <T>(
  url: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> => {
  const { headers = {}, body, timeout = API_ROUTES.TIMEOUT } = options;

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

  const isAuthEndpoint =
    url === API_ENDPOINTS.AUTH.LOGIN ||
    url === API_ENDPOINTS.AUTH.REFRESH_TOKEN;

  const fetchPromise = fetch(`${API_ROUTES.BASE_URL}${url}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (res.status === 401) {
      if (!isAuthEndpoint) {
        handleUnauthorized();
      }
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        errorBody?.message ||
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
      );
    }

    if (!res.ok) {
      const errorBody = await res.json().catch(async () => {
        const text = await res.text();
        return { message: text || res.statusText };
      });
      throw new Error(errorBody?.message || res.statusText);
    }

    return res.json() as Promise<T>;
  });

  return Promise.race([fetchPromise, handleTimeout(timeout)]);
};

const rootApiService = {
  get: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "GET", { headers }),
  post: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "POST", { body, headers }),
  put: <T>(url: string, body?: any, headers?: Record<string, string>) =>
    request<T>(url, "PUT", { body, headers }),
  delete: <T>(url: string, headers?: Record<string, string>) =>
    request<T>(url, "DELETE", { headers }),
};

export default rootApiService;
