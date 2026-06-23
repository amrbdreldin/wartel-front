import { UserRole } from "@/types/enums";

// ============================================================
// Dashboard Config – Per-role settings
// ============================================================

export interface DashboardConfig {
  role: UserRole;
  titleKey: string;
  colorScheme: "primary" | "secondary";
  showRedFlags: boolean;
  showStats: boolean;
}

export const dashboardConfigs: Record<UserRole, DashboardConfig> = {
  [UserRole.STUDENT]: {
    role: UserRole.STUDENT,
    titleKey: "student.dashboard",
    colorScheme: "primary",
    showRedFlags: false,
    showStats: false,
  },
  [UserRole.TEACHER]: {
    role: UserRole.TEACHER,
    titleKey: "teacher.dashboard",
    colorScheme: "primary",
    showRedFlags: false,
    showStats: false,
  },
  [UserRole.PARENT]: {
    role: UserRole.PARENT,
    titleKey: "parent.dashboard",
    colorScheme: "primary",
    showRedFlags: false,
    showStats: false,
  },
};
