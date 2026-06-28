import axios, {
    type AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from "axios";
import { toast } from "sonner";
import { API_BASE_URL, REFRESH_TOKEN_KEY, TOKEN_KEY } from "./constants";
import Cookies from "js-cookie";
import * as Sentry from "@sentry/nextjs";
import { shouldCaptureError } from "@/utils/sentry";


// ============================================================
// Axios Instance
// ============================================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ============================================================
// Request Interceptor – Attach Bearer Token
// ============================================================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access Cookies in client
    if (typeof window !== "undefined") {
      const token = Cookies.get(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ============================================================
// Response Interceptor – Handle Errors & Refresh
// ============================================================
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 – Attempt token refresh
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          // No refresh token – session is completely expired. Clean up and redirect.
          processQueue(new Error("No refresh token") as unknown as AxiosError, null);
          isRefreshing = false;
          Cookies.remove(TOKEN_KEY);
          Cookies.remove(REFRESH_TOKEN_KEY);
          if (typeof window !== "undefined") {
            const locale = window.location.pathname.split("/")[1] || "ar";
            window.location.href = `/${locale}/login`;
          }
          return Promise.reject(new Error("No refresh token"));
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newToken = data.data?.access_token;
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        Cookies.set(TOKEN_KEY, newToken, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });

        if (data.data?.refresh_token) {
          Cookies.set(REFRESH_TOKEN_KEY, data.data.refresh_token, { expires: 365, path: "/", secure: isSecure, sameSite: "lax" });
        }

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        // Clear tokens and redirect to locale-aware login page
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
        if (typeof window !== "undefined") {
          const locale = window.location.pathname.split("/")[1] || "ar";
          window.location.href = `/${locale}/login`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const responseData = error.response?.data as { message?: string; errors?: Record<string, string[]> };
    const mainMessage = responseData?.message || error.message || "An unexpected error occurred";
    const validationErrors = responseData?.errors;
    const isLoginRequest = originalRequest.url?.includes("/login");

    // Endpoints that handle their own validation display — skip global toast
    const silentEndpoints = ["/request-leave"];
    const isSilent = silentEndpoints.some((url) => originalRequest.url?.includes(url)) || (originalRequest as any).skipGlobalToast;

    // Don't toast on 401 (handled above) or cancel, unless it's a login request
    if (!isSilent && (error.response?.status !== 401 || isLoginRequest) && !axios.isCancel(error)) {
      if (validationErrors && typeof validationErrors === "object") {
        Object.values(validationErrors).forEach((messages) => {
          messages.forEach((msg) => toast.error(msg));
        });
      } else {
        toast.error(mainMessage);
      }
    }

    // Capture unexpected response and network errors in Sentry
    if (shouldCaptureError(error) && !axios.isCancel(error)) {
      Sentry.captureException(error);
    }

    return Promise.reject(error);
  }
);

export default api;
