// ============================================================
// Role Utilities
// ============================================================

interface RoleItem {
  id: string | number;
  name: string;
}

/**
 * Resolves the backend role ID for a given user type.
 * Fallbacks to standard IDs if not found in the dynamic roles list.
 */
export const resolveRoleId = (
  userType: string,
  userRoles: RoleItem[] = []
): string => {
  const roleMap: Record<string, string> = {
    student: "student",
    teacher: "teacher",
    parent: "parent",
  };

  const roleName = roleMap[userType] ?? userType;
  const found = userRoles.find((r) => r.name === roleName);

  if (!found) {
    if (userType === "teacher") return "2";
    if (userType === "parent") return "5";
    return "1"; // Default to student
  }

  return String(found.id);
};
