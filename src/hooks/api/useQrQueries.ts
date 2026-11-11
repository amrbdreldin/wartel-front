/**
 * useQrQueries.ts – Hook for resolving dynamic QR redirect codes.
 */
import type { Locale } from "@/lib/constants";
import { qrService, type QrCodeResponse } from "@/services/qr.service";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const qrKeys = {
  all: ["qr"] as const,
  detail: (code: string) => [...qrKeys.all, code] as const,
};

export function useQrCode(code: string) {
  const lang = useLocale() as Locale;
  return useQuery<QrCodeResponse>({
    queryKey: qrKeys.detail(code),
    queryFn: () => qrService.getQrCode(code, { lang }),
    enabled: !!code,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
