import type { AxiosRequestConfig } from "axios";
import { apiGet, type ApiCallOptions } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";

// ============================================================
// QR Code Service
// ============================================================

export interface QrCodeData {
  code: string;
  title?: string;
  target_url: string;
}

export type QrCodeResponse = ApiResponse<QrCodeData | null>;

export const qrService = {
  /**
   * Fetches the target redirect URL for a QR code.
   * Global error toasts are skipped because the QR page renders
   * the API error message directly in the UI.
   */
  getQrCode: (code: string, options?: ApiCallOptions): Promise<QrCodeResponse> =>
    apiGet<QrCodeResponse>(`/qr-codes/${encodeURIComponent(code)}`, {
      ...options,
      config: {
        ...options?.config,
        skipGlobalToast: true,
      } as AxiosRequestConfig & { skipGlobalToast?: boolean },
    }),
};
