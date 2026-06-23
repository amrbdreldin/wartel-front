import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useMediaQuery } from "../useMediaQuery";

describe("useMediaQuery", () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 768px)",
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return true if the media query matches", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("should return false if the media query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(result.current).toBe(false);
  });
});
