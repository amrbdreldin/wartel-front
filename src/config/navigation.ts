import { UserRole } from "@/types/enums";
import {
  Baby, Bell, BookOpen, ClipboardList, FileText, GraduationCap, LayoutDashboard, Library, MessageSquare, User, Scroll,
  type LucideIcon
} from "lucide-react";

// ============================================================
// Navigation Config – Sidebar items per role
// ============================================================

export interface NavItem {
  labelKey: string; // i18n key from nav namespace
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
}

export interface NavGroup {
  titleKey?: string;
  items: NavItem[];
}

/**
 * Get sidebar navigation items for a given role
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getNavigationByRole(role: UserRole, roleId?: string | number): NavGroup[] {
  switch (role) {
    case UserRole.STUDENT:
      return studentNavigation;
    case UserRole.TEACHER:
      return teacherNavigation;
    case UserRole.PARENT:
      return parentNavigation;
    default:
      return [];
  }
}

// ── Student Navigation ──────────────────────────────────────

const studentNavigation: NavGroup[] = [
  {
    items: [
      { labelKey: "nav.dashboard", href: "/student", icon: LayoutDashboard },
      { labelKey: "common.profile", href: "/student/[userId]/profile-details", icon: User },
      { labelKey: "nav.tamam", href: "/student/tamam", icon: BookOpen },
      { labelKey: "nav.werd", href: "/student/werd", icon: Scroll },
      { labelKey: "nav.grades", href: "/student/grades", icon: GraduationCap },
      { labelKey: "nav.excuses", href: "/student/excuses", icon: FileText },
      { labelKey: "nav.notifications", href: "/student/notifications", icon: Bell },
      { labelKey: "nav.messages", href: "/student/messages", icon: MessageSquare },
      { labelKey: "nav.library", href: "/student/library", icon: Library },
    ],
  },
];

// ── Teacher Navigation ──────────────────────────────────────

const teacherNavigation: NavGroup[] = [
  {
    items: [
      { labelKey: "nav.dashboard", href: "/teacher", icon: LayoutDashboard },
      { labelKey: "nav.notifications", href: "/teacher/notifications", icon: Bell },
      { labelKey: "nav.messages", href: "/teacher/messages", icon: MessageSquare },
      { labelKey: "nav.requests", href: "/teacher/requests", icon: ClipboardList },
      { labelKey: "nav.children", href: "/teacher/children", icon: Baby },

    ],
  },
];

// ── Parent Navigation ───────────────────────────────────────

const parentNavigation: NavGroup[] = [
  {
    items: [
      { labelKey: "nav.dashboard", href: "/parent", icon: LayoutDashboard },
    ],
  },
];
