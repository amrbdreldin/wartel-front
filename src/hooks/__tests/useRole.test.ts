import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRole } from "../useRole";
import { UserRole } from "@/types/enums";
import { useSelector } from "react-redux";

interface MockState {
  auth: {
    role: UserRole;
    user?: {
      role_id?: string | number;
    } | null;
  };
}

// Mock React-Redux hook dependencies
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

// Mock the selector directly
vi.mock("@/store/slices/authSlice", () => ({
  selectRole: (state: MockState) => state.auth.role,
  selectUser: (state: MockState) => state.auth.user,
}));

describe("useRole custom hook", () => {
  it("should extract permissions based on active student user roles", () => {
    // Mock useSelector to return a student role state
    vi.mocked(useSelector).mockImplementation((selector) =>
      (selector as (state: MockState) => unknown)({
        auth: { role: UserRole.STUDENT, user: { role_id: "1" } },
      })
    );

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe(UserRole.STUDENT);
    expect(result.current.isStudent).toBe(true);
    expect(result.current.isTeacher).toBe(false);
    expect(result.current.isParent).toBe(false);
    expect(result.current.isStudentChild).toBe(false);
    expect(result.current.hasRole(UserRole.STUDENT)).toBe(true);
    expect(result.current.hasAnyRole(UserRole.STUDENT, UserRole.TEACHER)).toBe(true);
  });

  it("should detect child student role (role_id: 3)", () => {
    // Mock useSelector to return a student with role_id: "3"
    vi.mocked(useSelector).mockImplementation((selector) =>
      (selector as (state: MockState) => unknown)({
        auth: { role: UserRole.STUDENT, user: { role_id: "3" } },
      })
    );

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe(UserRole.STUDENT);
    expect(result.current.isStudent).toBe(true);
    expect(result.current.isStudentChild).toBe(true);
  });

  it("should extract permissions based on active teacher user roles", () => {
    // Mock useSelector to return a teacher role state
    vi.mocked(useSelector).mockImplementation((selector) =>
      (selector as (state: MockState) => unknown)({
        auth: { role: UserRole.TEACHER, user: { role_id: "2" } },
      })
    );

    const { result } = renderHook(() => useRole());

    expect(result.current.role).toBe(UserRole.TEACHER);
    expect(result.current.isStudent).toBe(false);
    expect(result.current.isTeacher).toBe(true);
    expect(result.current.isParent).toBe(false);
    expect(result.current.isStudentChild).toBe(false);
    expect(result.current.hasRole(UserRole.TEACHER)).toBe(true);
    expect(result.current.hasAnyRole(UserRole.STUDENT, UserRole.PARENT)).toBe(false);
  });
});

