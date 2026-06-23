/**
 * useParentQueries.ts – READ hooks for parent role.
 * Mutations (forms) → useParentMutations.ts
 */
import type { Locale } from "@/lib/constants";
import { parentService } from "@/services/parent.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const parentKeys = {
  all: ["parent"] as const,
  dashboard: () => [...parentKeys.all, "dashboard"] as const,
  children: () => [...parentKeys.all, "children"] as const,
};

export function useParentDashboard() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: parentKeys.dashboard(),
    queryFn: () => parentService.getDashboard({ lang }),
    retry: 1,
  });
}

export function useParentChildren() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: parentKeys.children(),
    queryFn: () => parentService.getChildren({ lang }),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

export function useParentAddStudent() {
  const queryClient = useQueryClient();
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (data: FormData) => parentService.addStudent(data, { lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentKeys.children() });
    },
  });
}

export function useParentSwitchToChild() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (childId: string) => parentService.switchToChild(childId, { lang }),
  });
}

export function useParentLoginAsStudent() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (studentId: number) => parentService.loginAsStudent(studentId, { lang }),
  });
}
