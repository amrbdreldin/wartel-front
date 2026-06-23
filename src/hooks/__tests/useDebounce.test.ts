import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("should delay updating the value until the delay period has elapsed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "hello", delay: 300 },
      }
    );

    expect(result.current).toBe("hello");

    // Rerender with a new value
    rerender({ value: "world", delay: 300 });

    // It should still have the old value immediately
    expect(result.current).toBe("hello");

    // Fast-forward time slightly, but not past the delay
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("hello");

    // Fast-forward the rest of the delay time
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("world");
  });

  it("should clear previous timeout when values change rapidly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "first", delay: 300 },
      }
    );

    expect(result.current).toBe("first");

    // Rerender with "second"
    rerender({ value: "second", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first"); // Not yet updated

    // Rerender with "third" before the 300ms has elapsed
    rerender({ value: "third", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Total elapsed since second: 400ms, but since third was set, the timer reset.
    // So "third" is still not updated because only 200ms has passed since its trigger.
    expect(result.current).toBe("first");

    // Fast-forward past the final timer delay
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("third");
  });
});
