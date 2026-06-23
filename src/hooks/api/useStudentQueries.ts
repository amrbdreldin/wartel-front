/**
 * useStudentQueries.ts
 * ─────────────────────────────────────────────────────────────
 * TanStack Query READ hooks for the student role.
 * Mutations (forms) → useStudentMutations.ts
 * ─────────────────────────────────────────────────────────────
 */
import type { Locale } from "@/lib/constants";
import { STALE_TIME } from "@/lib/constants";
import { studentService } from "@/services/student.service";
import type { QueryParams } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const studentKeys = {
  all: ["student"] as const,
  dashboard: () => [...studentKeys.all, "dashboard"] as const,
  grades: (params?: QueryParams) => [...studentKeys.all, "grades", params] as const,
  excuses: (params?: QueryParams) => [...studentKeys.all, "excuses", params] as const,
  notifications: (params?: QueryParams) => [...studentKeys.all, "notifications", params] as const,
  library: (params?: QueryParams) => [...studentKeys.all, "library", params] as const,
  settings: () => [...studentKeys.all, "settings"] as const,
  warnings: () => [...studentKeys.all, "warnings"] as const,
};

export function useStudentDashboard() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.dashboard(),
    queryFn: () => studentService.getDashboard({ lang }),
    staleTime: STALE_TIME.SHORT,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export function useStudentGrades(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.grades(params),
    queryFn: () => studentService.getGrades(params, { lang }),
  });
}

export function useStudentExcuses(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.excuses(params),
    queryFn: () => studentService.getExcuses(params, { lang }),
  });
}

export function useStudentNotifications(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.notifications(params),
    queryFn: () => studentService.getNotifications(params, { lang }),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useStudentLibrary(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.library(params),
    queryFn: () => studentService.getLibrary(params, { lang }),
  });
}

export function useStudentSettings() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.settings(),
    queryFn: () => studentService.getSettings({ lang }),
    staleTime: STALE_TIME.LONG,
  });
}

export function useStudentWarnings() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: studentKeys.warnings(),
    queryFn: () => studentService.getWarnings({ lang }),
    retry: 1, // 1 retry only – avoid hammering a broken endpoint
    retryDelay: 2000,
  });
}
