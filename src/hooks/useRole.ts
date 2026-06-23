"use client";

import type { RootState } from "@/store";
import { selectRole, selectUser } from "@/store/slices/authSlice";
import { UserRole } from "@/types/enums";
import { useSelector } from "react-redux";

// ============================================================
// useRole – Role check helpers
// ============================================================

export function useRole() {
  const role = useSelector((state: RootState) => selectRole(state));
  const user = useSelector((state: RootState) => selectUser(state));

  return {
    role,
    isStudent: role === UserRole.STUDENT,
    isTeacher: role === UserRole.TEACHER,
    isParent: role === UserRole.PARENT,
    isStudentChild: String(user?.role_id) === "3",
    hasRole: (r: UserRole) => role === r,
    hasAnyRole: (...roles: UserRole[]) => role ? roles.includes(role) : false,
  };
}
