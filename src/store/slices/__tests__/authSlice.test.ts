import { describe, expect, it } from "vitest";
import { UserRole } from "@/types/enums";
import { parseUserCookie } from "../authSlice";

describe("parseUserCookie", () => {
  it("returns null for missing or malformed values", () => {
    expect(parseUserCookie(undefined)).toBeNull();
    expect(parseUserCookie("")).toBeNull();
    expect(parseUserCookie("{not json")).toBeNull();
  });

  it("resolves the role from role_id when role is missing", () => {
    expect(parseUserCookie(JSON.stringify({ id: 1, role_id: 2 }))?.role).toBe(UserRole.TEACHER);
    expect(parseUserCookie(JSON.stringify({ id: 1, role_id: "3" }))?.role).toBe(UserRole.STUDENT);
    expect(parseUserCookie(JSON.stringify({ id: 1, role_id: 5 }))?.role).toBe(UserRole.PARENT);
  });

  it("keeps an explicit role", () => {
    expect(parseUserCookie(JSON.stringify({ id: 1, role: "teacher", role_id: 1 }))?.role).toBe("teacher");
  });
});
