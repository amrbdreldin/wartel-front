import { describe, it, expect } from "vitest";
import { isValidPhoneByPattern } from "../phone";

describe("Phone Validation Utilities", () => {
  describe("isValidPhoneByPattern", () => {
    it("should return false for empty or undefined inputs", () => {
      expect(isValidPhoneByPattern(undefined)).toBe(false);
      expect(isValidPhoneByPattern(null)).toBe(false);
      expect(isValidPhoneByPattern("")).toBe(false);
    });

    it("should validate Egyptian phone numbers successfully", () => {
      // Egypt pattern: /^\+20[\s\-]?[0]?1[0-9]{9}$/
      expect(isValidPhoneByPattern("+201012345678")).toBe(true);
      expect(isValidPhoneByPattern("+2001112345678")).toBe(true);
      expect(isValidPhoneByPattern("+201212345678")).toBe(true);
      expect(isValidPhoneByPattern("+201512345678")).toBe(true);
    });

    it("should validate Saudi Arabian phone numbers successfully", () => {
      // Saudi Arabia pattern: /^\+966[\s\-]?[5][0-9]{8}$/
      expect(isValidPhoneByPattern("+966501234567")).toBe(true);
      expect(isValidPhoneByPattern("+966551234567")).toBe(true);
    });

    it("should validate UAE phone numbers successfully", () => {
      // UAE pattern: /^\+971[\s\-]?[5][0-9]{8}$/
      expect(isValidPhoneByPattern("+971501234567")).toBe(true);
      expect(isValidPhoneByPattern("+971551234567")).toBe(true);
    });

    it("should return false for invalid formats or unrecognized countries", () => {
      expect(isValidPhoneByPattern("12345")).toBe(false);
      expect(isValidPhoneByPattern("+20123")).toBe(false); // Too short
      expect(isValidPhoneByPattern("invalid-number")).toBe(false);
    });
  });
});
