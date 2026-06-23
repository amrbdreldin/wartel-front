import { describe, it, expect } from "vitest";
import { UserRole } from "@/types/enums";
import { canAccessRoute, getDefaultRoute, getRoleLabelKey } from "../permissions";

describe("Permissions Utilities", () => {
  describe("canAccessRoute", () => {
    it("should deny access if no role is provided", () => {
      expect(canAccessRoute(undefined, "/student")).toBe(false);
    });

    it("should allow student role to access /student routes and deny other restricted prefixes", () => {
      expect(canAccessRoute(UserRole.STUDENT, "/student")).toBe(true);
      expect(canAccessRoute(UserRole.STUDENT, "/student/profile")).toBe(true);
      expect(canAccessRoute(UserRole.STUDENT, "/teacher")).toBe(false);
      expect(canAccessRoute(UserRole.STUDENT, "/parent")).toBe(false);
    });

    it("should allow teacher role to access /teacher and /student routes and deny other restricted prefixes", () => {
      expect(canAccessRoute(UserRole.TEACHER, "/teacher")).toBe(true);
      expect(canAccessRoute(UserRole.TEACHER, "/teacher/classes")).toBe(true);
      expect(canAccessRoute(UserRole.TEACHER, "/student")).toBe(true);
      expect(canAccessRoute(UserRole.TEACHER, "/parent")).toBe(false);
    });

    it("should allow parent role to access /parent routes and deny other restricted prefixes", () => {
      expect(canAccessRoute(UserRole.PARENT, "/parent")).toBe(true);
      expect(canAccessRoute(UserRole.PARENT, "/parent/children")).toBe(true);
      expect(canAccessRoute(UserRole.PARENT, "/student")).toBe(false);
      expect(canAccessRoute(UserRole.PARENT, "/teacher")).toBe(false);
    });

    it("should allow access to non-restricted routes for any role", () => {
      expect(canAccessRoute(UserRole.STUDENT, "/")).toBe(true);
      expect(canAccessRoute(UserRole.TEACHER, "/about")).toBe(true);
      expect(canAccessRoute(UserRole.PARENT, "/contact")).toBe(true);
    });
  });

  describe("getDefaultRoute", () => {
    it("should return the correct default route path for each role", () => {
      expect(getDefaultRoute(UserRole.STUDENT)).toBe("/student");
      expect(getDefaultRoute(UserRole.TEACHER)).toBe("/teacher");
      expect(getDefaultRoute(UserRole.PARENT)).toBe("/parent");
    });

    it("should fall back to home for unknown roles", () => {
      // Cast invalid role to test fallback
      expect(getDefaultRoute("invalid" as UserRole)).toBe("/");
    });
  });

  describe("getRoleLabelKey", () => {
    it("should return the correct localization key path for each role", () => {
      expect(getRoleLabelKey(UserRole.STUDENT)).toBe("auth.student");
      expect(getRoleLabelKey(UserRole.TEACHER)).toBe("teacher.dashboard");
      expect(getRoleLabelKey(UserRole.PARENT)).toBe("parent.dashboard");
    });
  });
});
