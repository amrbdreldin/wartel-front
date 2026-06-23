"use client";

/**
 * useAuthMutations.ts
 * ─────────────────────────────────────────────────────────────
 * TanStack Query mutation hooks for auth form operations.
 *
 * Pattern:
 *  • Pages that READ data  → useQuery  (in hooks/api/use*Queries.ts)
 *  • Forms that WRITE data → useMutation (here)
 *
 * Usage example:
 *   const { mutate: login, isPending } = useLoginMutation();
 *   login({ email, password });
 * ─────────────────────────────────────────────────────────────
 */

import { authService } from "@/services/auth.service";
import type { LoginRequest, User, RegisterFormData } from "@/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { Locale } from "@/lib/constants";
import * as Sentry from "@sentry/nextjs";

// ─── Login ────────────────────────────────────────────────────
export function useLoginMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (data: LoginRequest) => {
      const { recaptcha_token, ...payload } = data;
      return authService.login(payload, {
        lang,
        config: {
          skipGlobalToast: true,
          ...(recaptcha_token
            ? {
                headers: {
                  "X-Recaptcha-Token": recaptcha_token,
                },
              }
            : {}),
        } as any,
      });
    },
  });
}

// ─── Register ─────────────────────────────────────────────────
export function useRegisterMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (formData: FormData) => {
      const recaptchaToken = (formData.get("recaptcha_token") as string) || "";
      formData.delete("recaptcha_token");
      return authService.register(formData, {
        lang,
        config: {
          skipGlobalToast: true,
          ...(recaptchaToken
            ? {
                headers: {
                  "X-Recaptcha-Token": recaptchaToken,
                },
              }
            : {}),
        } as any,
      });
    },
  });
}

// ─── Parent Register ──────────────────────────────────────────
export function useParentRegisterMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (data: { mobile: string; password: string; full_name: string; recaptcha_token?: string; firebase_token?: string }) => {
      const { recaptcha_token, ...payload } = data;
      return authService.parentRegister(payload, {
        lang,
        config: {
          skipGlobalToast: true,
          ...(recaptcha_token
            ? {
                headers: {
                  "X-Recaptcha-Token": recaptcha_token,
                },
              }
            : {}),
        } as any,
      });
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const lang = useLocale() as Locale;

  return useMutation({
    mutationFn: () => authService.logout({ lang }),
    onSuccess: () => {
      // Wipe all cached queries on logout
      queryClient.clear();
    },
  });
}

// ─── Forgot password – request OTP ───────────────────────────
export function useForgotPasswordMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (phone: string) =>
      authService.forgotPassword(phone, { lang }),
  });
}

// ─── Forgot password – verify OTP ────────────────────────────
export function useVerifyOtpMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (payload: { phone: string; otp: string }) =>
      authService.verifyOtp(payload, { lang }),
  });
}

// ─── Reset password ───────────────────────────────────────────
export function useResetPasswordMutation() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (payload: { phone: string; otp: string; new_password: string; new_password_confirmation: string }) =>
      authService.resetPassword(payload, { lang }),
  });
}

// ─── Update profile ───────────────────────────────────────────
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const lang = useLocale() as Locale;

  return useMutation({
    mutationFn: (data: Partial<User>) => authService.updateProfile(data, { lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
    onError: (err) => {
      Sentry.captureException(err);
    },
  });
}

// ─── Register form data (tracks, roles, enrollment types) ─────
/**
 * Fetches /data on the first visit to the register page.
 * Kept memory-only for high security and performance.
 */
export function useRegisterFormDataQuery() {
  const lang = useLocale() as Locale;

  return useQuery<RegisterFormData>({
    queryKey: ["register", "form-data"],
    queryFn: async () => {
      try {
        return await authService.getFormData({ lang });
      } catch (err) {
        Sentry.captureException(err);
        throw err;
      }
    },
    staleTime: Infinity,   // never stale once we have it
    gcTime: Infinity,      // keep in memory for the session
    retry: 2,
  });
}
