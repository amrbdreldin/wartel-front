import axios, {
    type AxiosError,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "./constants";
import { CLIENT_REQUEST_HEADER, endServerSession } from "./session-client";


// ============================================================
// Axios Instance
// ------------------------------------------------------------
// Auth tokens live in HttpOnly cookies owned by the server. The proxy
// (/api/proxy) attaches them and refreshes expired tokens itself, so the
// browser never handles a token. Same-origin cookies are sent automatically.
// ============================================================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...CLIENT_REQUEST_HEADER,
  },
});

function isCurrentPagePublic(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  const cleanPath = path.replace(/^\/(ar|en)(?=\/|$)/, "");
  return (
    cleanPath === "" ||
    cleanPath === "/" ||
    cleanPath.startsWith("/courses") ||
    cleanPath.startsWith("/register") ||
    cleanPath.startsWith("/login") ||
    cleanPath.startsWith("/forgot-password") ||
    cleanPath.startsWith("/instructions")
  );
}

function redirectToLogin() {
  if (typeof window !== "undefined" && !isCurrentPagePublic()) {
    const locale = window.location.pathname.split("/")[1] || "ar";
    window.location.href = `/${locale}/login`;
  }
}

// ============================================================
// Response Interceptor – Handle Errors & Expired Sessions
// ============================================================
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 here means the server could not refresh the session (it already tried)
    const isPublicEndpoint = originalRequest?.url?.includes("/direct-join") || originalRequest?.url?.includes("/groups/join");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login")
    ) {
      originalRequest._retry = true;

      if (isPublicEndpoint) {
        // Public/Guest endpoint – drop the invalid session and retry as a guest without redirecting
        await endServerSession("active");
        return api(originalRequest);
      }

      // Session is completely expired. Clean up (keeps a teacher/parent backup, as before).
      await endServerSession("active");
      redirectToLogin();
      return Promise.reject(error);
    }

    // Handle other errors
    const responseData = error.response?.data as { message?: string; errors?: Record<string, string[]> };
    const mainMessage = responseData?.message || error.message || "An unexpected error occurred";
    const validationErrors = responseData?.errors;
    const isLoginRequest = originalRequest?.url?.includes("/login");

    // Endpoints that handle their own validation display — skip global toast
    const silentEndpoints = ["/request-leave"];
    const isSilent =
      silentEndpoints.some((url) => originalRequest?.url?.includes(url)) ||
      (originalRequest as { skipGlobalToast?: boolean } | undefined)?.skipGlobalToast;

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


    return Promise.reject(error);
  }
);

export default api;
