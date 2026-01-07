/**
 * Unit Tests for useDebounce Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("should not update value before delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    // Change the value
    rerender({ value: "updated", delay: 300 });

    // Before delay passes, should still be initial value
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe("initial");
  });

  it("should update value after delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    // Change the value
    rerender({ value: "updated", delay: 300 });

    // After delay passes, should be updated value
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset timer when value changes before delay completes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    // First update
    rerender({ value: "first", delay: 300 });

    // Wait 200ms (not enough)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Second update - should reset timer
    rerender({ value: "second", delay: 300 });

    // Wait another 200ms (300ms total since last change, but only 200ms since second update)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should still be initial because timer was reset
    expect(result.current).toBe("initial");

    // Wait remaining 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Now should be 'second'
    expect(result.current).toBe("second");
  });

  it("should use default delay of 300ms when not provided", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });

    // Before 300ms
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    // After 300ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with custom delay values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } },
    );

    rerender({ value: "updated", delay: 500 });

    // Before 500ms
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    // After 500ms
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should work with zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 0 } },
    );

    rerender({ value: "updated", delay: 0 });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });

  it("should handle different value types - numbers", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } },
    );

    rerender({ value: 42, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });

  it("should handle different value types - objects", () => {
    const initialObj = { name: "initial" };
    const updatedObj = { name: "updated" };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } },
    );

    rerender({ value: updatedObj, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it("should handle different value types - arrays", () => {
    const initialArr = [1, 2, 3];
    const updatedArr = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialArr, delay: 300 } },
    );

    rerender({ value: updatedArr, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedArr);
  });

  it("should handle null and undefined values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: null, delay: 300 } },
    );

    expect(result.current).toBeNull();

    rerender({ value: undefined, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBeUndefined();
  });

  it("should handle boolean values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: false, delay: 300 } },
    );

    expect(result.current).toBe(false);

    rerender({ value: true, delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(true);
  });

  it("should handle rapid successive value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } },
    );

    // Rapid changes
    rerender({ value: "b", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender({ value: "c", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender({ value: "d", delay: 300 });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    rerender({ value: "e", delay: 300 });

    // Should still be 'a' as timer keeps resetting
    expect(result.current).toBe("a");

    // Wait for full delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should be the last value 'e'
    expect(result.current).toBe("e");
  });

  it("should handle delay change", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    // Change both value and delay
    rerender({ value: "updated", delay: 500 });

    // Wait original delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be initial (new delay is 500ms)
    expect(result.current).toBe("initial");

    // Wait remaining time
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("updated");
  });

  it("should clean up timer on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } },
    );

    rerender({ value: "updated", delay: 300 });

    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("should work correctly in a search input scenario", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "", delay: 300 } },
    );

    // Simulate typing "hello" character by character
    const searchTerm = "hello";
    for (let i = 0; i < searchTerm.length; i++) {
      rerender({ value: searchTerm.slice(0, i + 1), delay: 300 });
      act(() => {
        vi.advanceTimersByTime(50); // 50ms between keystrokes
      });
    }

    // Should still be empty string (debounced)
    expect(result.current).toBe("");

    // Wait for debounce to complete
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now should have the full search term
    expect(result.current).toBe("hello");
  });
});
