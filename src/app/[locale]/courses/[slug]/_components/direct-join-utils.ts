import type { DirectJoinGroupRole } from "@/services/group.service";
import { UserRole } from "@/types/enums";

// ============================================================
// Direct-join – shared role matching & error extraction helpers
// ============================================================

export interface DirectJoinApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

/** Extracts the first validation error or top-level message from an API error. */
export function extractDirectJoinError(err: DirectJoinApiError | null | undefined, fallback: string): string {
  const responseData = err?.response?.data;
  const validationErrors = responseData?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const first = Object.values(validationErrors).flat()[0];
    if (first) return first;
  }
  return responseData?.message || err?.message || fallback;
}

/** Map UserRole enum to the corresponding `allowed_roles` IDs returned by the API. */
export const ROLE_ID_MAP: Record<string, number[]> = {
  [UserRole.STUDENT]: [1],
  [UserRole.TEACHER]: [2],
  [UserRole.PARENT]: [5],
};

export const isParentRole = (r: DirectJoinGroupRole) =>
  Number(r.id) === 5 || Boolean(r.name?.includes("ولي") || r.name?.toLowerCase().includes("parent"));

export const isSonRole = (r: DirectJoinGroupRole) => {
  const lower = r.name?.toLowerCase() ?? "";
  return (
    Number(r.id) === 3 ||
    Boolean(r.name?.includes("ابن") || r.name?.includes("طفل") || lower.includes("son") || lower.includes("child"))
  );
};

export const isStudentRole = (r: DirectJoinGroupRole) => {
  const lower = r.name?.toLowerCase() ?? "";
  return (
    Number(r.id) === 1 ||
    Boolean(
      (r.name?.includes("طالب") && !r.name.includes("ابن") && !r.name.includes("طفل")) ||
        (lower.includes("student") && !lower.includes("son") && !lower.includes("child"))
    )
  );
};

export function resolveGroupRoles(allowedRoles?: DirectJoinGroupRole[]) {
  const hasParentRole = Boolean(allowedRoles?.some(isParentRole));
  const hasSonRole = Boolean(allowedRoles?.some(isSonRole));
  const hasParentOrSonRole = hasParentRole || hasSonRole;
  const hasStudentRole = !allowedRoles?.length || allowedRoles.some(isStudentRole);

  return {
    hasParentRole,
    hasSonRole,
    hasParentOrSonRole,
    hasStudentRole,
    parentRole: allowedRoles?.find(isParentRole),
    studentRole: allowedRoles?.find(isStudentRole),
  };
}

