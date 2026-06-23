import { UserRole } from "@/types/enums";

// ============================================================
// Permission Helpers
// ============================================================

/**
 * Role-based route access map
 */
const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/student": [UserRole.STUDENT, UserRole.TEACHER],
  "/teacher": [UserRole.TEACHER],
  "/parent": [UserRole.PARENT],
};

/**
 * Check if a role can access a given route prefix
 */
export function canAccessRoute(role: UserRole | undefined, pathname: string): boolean {
  if (!role) return false;

  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_ACCESS)) {
    if (pathname.startsWith(routePrefix)) {
      return allowedRoles.includes(role);
    }
  }
  return true; // Allow non-protected routes
}

/**
 * Get the default dashboard route for a role
 */
export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case UserRole.STUDENT:
      return "/student";
    case UserRole.TEACHER:
      return "/teacher";
    case UserRole.PARENT:
      return "/parent";
    default:
      return "/";
  }
}

/**
 * Get the role label key for i18n
 */
export function getRoleLabelKey(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [UserRole.STUDENT]: "auth.student",
    [UserRole.TEACHER]: "teacher.dashboard",
    [UserRole.PARENT]: "parent.dashboard",
  };
  return labels[role];
}
