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
 * Fetches registration form data (tracks, etc.) for a specific role ID.
 * Kept memory-only for high security and performance.
 */
export function useRegisterFormDataQuery(roleId?: string | number | null) {
  const lang = useLocale() as Locale;
  const resolvedRoleId = roleId ?? 1;

  return useQuery<RegisterFormData>({
    queryKey: ["register", "form-data", "role", resolvedRoleId],
    queryFn: async () => {
      try {
        const res = await authService.getRegisterData(resolvedRoleId, { lang });
        return {
          tracks: res.tracks,
          user_roles: [],
          enrollment_types: [
            {
              id: 1,
              name: "Academy",
              tracks: res.tracks,
            },
          ],
        } as RegisterFormData;
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
