/**
 * api-client.ts
 * ─────────────────────────────────────────────────────────────
 * Typed, low-level HTTP client used by every service and hook.
 *
 * All requests go through the Next.js proxy (/api/proxy/...)
 * so the real upstream URL is NEVER visible in the browser.
 *
 * Features
 * ────────
 * • get / post / patch / put / delete helpers (typed generics)
 * • Automatic `Accept-Language` header injection from `lang` param
 * • Automatic Bearer token injection from Cookies
 * • Centralised error normalisation
 * ─────────────────────────────────────────────────────────────
 */

import type { AxiosRequestConfig } from "axios";
import api from "./axios"; // the existing axios instance (baseURL = /api/proxy)
import type { Locale } from "./constants";

// ─── Options shared by all methods ───────────────────────────
export interface ApiCallOptions {
  /** BCP-47 locale tag forwarded as Accept-Language to the upstream API */
  lang?: Locale;
  /** Any additional Axios config (headers, params, signal …) */
  config?: AxiosRequestConfig;
}

// ─── Helpers ──────────────────────────────────────────────────

function buildConfig(options?: ApiCallOptions): AxiosRequestConfig {
  const { lang, config = {} } = options ?? {};
  const headers: Record<string, string> = { ...(config.headers as Record<string, string>) };
  if (lang) headers["Accept-Language"] = lang;
  return { ...config, headers };
}

// ─── GET ──────────────────────────────────────────────────────
/**
 * Typed GET request.
 *
 * @example
 * const data = await apiGet<User[]>("/users", { lang: "ar", config: { params: { page: 1 } } });
 */
export async function apiGet<TResponse>(
  url: string,
  options?: ApiCallOptions
): Promise<TResponse> {
  const res = await api.get<TResponse>(url, buildConfig(options));
  return res.data;
}

// ─── POST ─────────────────────────────────────────────────────
/**
 * Typed POST request.
 *
 * @example
 * const result = await apiPost<LoginResponse>("/auth/login", { email, password });
 */
export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: ApiCallOptions
): Promise<TResponse> {
  const res = await api.post<TResponse>(url, body, buildConfig(options));
  return res.data;
}

// ─── PUT ──────────────────────────────────────────────────────
/**
 * Typed PUT request (full resource replacement).
 */
export async function apiPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: ApiCallOptions
): Promise<TResponse> {
  const res = await api.put<TResponse>(url, body, buildConfig(options));
  return res.data;
}

// ─── PATCH ────────────────────────────────────────────────────
/**
 * Typed PATCH request (partial update).
 *
 * @example
 * await apiPatch<User>("/profile", { name: "Ahmed" }, { lang: "ar" });
 */
export async function apiPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  options?: ApiCallOptions
): Promise<TResponse> {
  const res = await api.patch<TResponse>(url, body, buildConfig(options));
  return res.data;
}

// ─── DELETE ───────────────────────────────────────────────────
/**
 * Typed DELETE request.
 *
 * @example
 * await apiDelete<void>("/users/123");
 */
export async function apiDelete<TResponse>(
  url: string,
  options?: ApiCallOptions
): Promise<TResponse> {
  const res = await api.delete<TResponse>(url, buildConfig(options));
  return res.data;
}

// ─── Form-data helper ─────────────────────────────────────────
/**
 * POST a FormData payload (file upload etc.).
 * Content-Type is automatically set to multipart/form-data by Axios.
 */
export async function apiUpload<TResponse>(
  url: string,
  formData: FormData,
  options?: ApiCallOptions
): Promise<TResponse> {
  const cfg = buildConfig(options);
  const res = await api.post<TResponse>(url, formData, {
    timeout: 0, // Disable default 30s timeout for file uploads
    ...cfg,
    headers: { ...cfg.headers, "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
