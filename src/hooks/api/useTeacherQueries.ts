/**
 * useTeacherQueries.ts – READ hooks for teacher role.
 * Mutations (forms) → useTeacherMutations.ts
 */
import type { Locale } from "@/lib/constants";
import { teacherService } from "@/services/teacher.service";
import type { QueryParams } from "@/types/api.types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocale } from "next-intl";

export const teacherKeys = {
  all: ["teacher"] as const,
  dashboard: () => [...teacherKeys.all, "dashboard"] as const,
  groups: () => [...teacherKeys.all, "groups"] as const,
  groupsWithStudents: () => [...teacherKeys.all, "groupsWithStudents"] as const,
  groupStudents: (groupId: string | number) => [...teacherKeys.all, "groupStudents", groupId] as const,
  attendance: (groupId: string, date: string) =>
    [...teacherKeys.all, "attendance", groupId, date] as const,
  requests: (params?: QueryParams) => [...teacherKeys.all, "requests", params] as const,
  notifications: (params?: QueryParams) => [...teacherKeys.all, "notifications", params] as const,
  warnings: () => [...teacherKeys.all, "warnings"] as const,
};

export function useTeacherDashboard() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.dashboard(),
    queryFn: () => teacherService.getDashboard({ lang }),
  });
}

export function useTeacherGroups() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.groups(),
    queryFn: () => teacherService.getGroups({ lang }),
  });
}

export function useTeacherGroupsWithStudents() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.groupsWithStudents(),
    queryFn: () => teacherService.getGroupsWithStudents({ lang }),
  });
}

export function useTeacherGroupStudents(groupId: string | number) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.groupStudents(groupId),
    queryFn: () => teacherService.getGroupStudents(groupId, { lang }),
    enabled: !!groupId,
  });
}

export function useTeacherAttendance(groupId: string, date: string) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.attendance(groupId, date),
    queryFn: () => teacherService.getAttendance(groupId, date, { lang }),
    enabled: !!groupId && !!date,
  });
}

export function useTeacherRequests(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.requests(params),
    queryFn: () => teacherService.getLeaves(params, { lang }),
  });
}
export function useTeacherSessionAttendance(
  sessionId: string | number,
  options?: { refetchInterval?: number | false }
) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: [...teacherKeys.all, "sessionAttendance", sessionId],
    queryFn: () => teacherService.getSessionAttendance(sessionId, { lang }),
    enabled: !!sessionId,
    retry: 0, // Don't hammer a potentially broken session endpoint
    ...options,
  });
}

export function useTeacherNotifications(params?: QueryParams) {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.notifications(params),
    queryFn: () => teacherService.getNotifications(params, { lang }),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    refetchInterval: 300000, // Fetch notifications every 5 minutes
    staleTime: 60000,
  });
}

export function useTeacherWarnings() {
  const lang = useLocale() as Locale;
  return useQuery({
    queryKey: teacherKeys.warnings(),
    queryFn: () => teacherService.getWarnings({ lang }),
  });
}

export function useTeacherLoginAsStudent() {
  const lang = useLocale() as Locale;
  return useMutation({
    mutationFn: (studentId: number) => teacherService.loginAsStudent(studentId, { lang }),
  });
}
