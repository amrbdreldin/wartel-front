import { describe, it, expect } from "vitest";
import { formatDate, formatTime, formatPercentage, formatNumber, truncate, formatRelativeTime } from "../format";

describe("Format Utilities", () => {
  describe("formatDate", () => {
    it("should format a date string to a locale-aware date", () => {
      const dateStr = "2026-05-25T12:00:00Z";
      // Using "en-US" to keep output predictable for testing
      const formatted = formatDate(dateStr, "en-US");
      expect(formatted).toContain("May");
      expect(formatted).toContain("2026");
    });

    it("should handle Date objects", () => {
      const date = new Date(2026, 4, 25); // May 25, 2026
      const formatted = formatDate(date, "en-US");
      expect(formatted).toContain("May");
      expect(formatted).toContain("25");
      expect(formatted).toContain("2026");
    });
  });

  describe("formatTime", () => {
    it("should format a date string to locale-aware time", () => {
      const dateStr = "2026-05-25T12:30:00Z";
      const formatted = formatTime(dateStr, "en-US");
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe("formatPercentage", () => {
    it("should format number as percentage", () => {
      expect(formatPercentage(85)).toBe("85%");
      expect(formatPercentage(92.5, 1)).toBe("92.5%");
    });
  });

  describe("formatNumber", () => {
    it("should format number with locale separators", () => {
      const num = 1250000;
      const formattedAr = formatNumber(num, "ar-SA");
      // Arabic locale formatting could use Arabic Indic numerals or commas
      expect(formattedAr).toBeDefined();

      const formattedEn = formatNumber(num, "en-US");
      expect(formattedEn).toBe("1,250,000");
    });
  });

  describe("truncate", () => {
    it("should not truncate text if it is within maxLength", () => {
      const text = "Wartel Academy";
      expect(truncate(text, 20)).toBe(text);
    });

    it("should truncate text and append ellipsis if it exceeds maxLength", () => {
      const text = "Quranic education for the modern era";
      const truncated = truncate(text, 15);
      expect(truncated).toBe("Quranic educati...");
    });
  });

  describe("formatRelativeTime", () => {
    it("should return relative time description", () => {
      const now = new Date();
      // 2 hours ago
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      const relativeEn = formatRelativeTime(twoHoursAgo, "en");
      expect(relativeEn).toBe("2 hours ago");
    });
  });
});
