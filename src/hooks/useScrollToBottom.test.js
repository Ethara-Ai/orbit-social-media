/**
 * Unit Tests for useScrollToBottom Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useScrollToBottom from "./useScrollToBottom";

describe("useScrollToBottom", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("return values", () => {
    it("should return bottomRef", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(result.current.bottomRef).toBeDefined();
      expect(result.current.bottomRef).toHaveProperty("current");
    });

    it("should return containerRef", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef).toHaveProperty("current");
    });

    it("should return scrollToBottom function", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(typeof result.current.scrollToBottom).toBe("function");
    });

    it("should return checkIfAtBottom function", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(typeof result.current.checkIfAtBottom).toBe("function");
    });

    it("should return handleScroll function", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(typeof result.current.handleScroll).toBe("function");
    });

    it("should return isAtBottom boolean", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(typeof result.current.isAtBottom).toBe("boolean");
    });

    it("should have isAtBottom as true by default", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(result.current.isAtBottom).toBe(true);
    });
  });

  describe("scrollToBottom", () => {
    it("should call scrollIntoView on bottomRef element", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });
    });

    it("should use provided scroll behavior", () => {
      const { result } = renderHook(() =>
        useScrollToBottom([], { behavior: "instant" }),
      );

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "instant",
      });
    });

    it("should allow overriding behavior when calling scrollToBottom", () => {
      const { result } = renderHook(() =>
        useScrollToBottom([], { behavior: "smooth" }),
      );

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom("instant");
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "instant",
      });
    });

    it("should not throw when bottomRef is null", () => {
      const { result } = renderHook(() => useScrollToBottom());
      result.current.bottomRef.current = null;

      expect(() => {
        act(() => {
          result.current.scrollToBottom();
        });
      }).not.toThrow();
    });
  });

  describe("checkIfAtBottom", () => {
    it("should return true when at bottom of container", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 900,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      expect(isAtBottom).toBe(true);
    });

    it("should return false when not at bottom of container", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      expect(isAtBottom).toBe(false);
    });

    it("should consider within 100px of bottom as at bottom", () => {
      const { result } = renderHook(() => useScrollToBottom());

      // scrollHeight - scrollTop - clientHeight = 1000 - 810 - 100 = 90 < 100
      const mockContainer = {
        scrollTop: 810,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      expect(isAtBottom).toBe(true);
    });

    it("should not consider 101px from bottom as at bottom", () => {
      const { result } = renderHook(() => useScrollToBottom());

      // scrollHeight - scrollTop - clientHeight = 1000 - 799 - 100 = 101 >= 100
      const mockContainer = {
        scrollTop: 799,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      expect(isAtBottom).toBe(false);
    });

    it("should update isAtBottom state", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.checkIfAtBottom();
      });

      expect(result.current.isAtBottom).toBe(false);
    });

    it("should return current isAtBottom when containerRef is null", () => {
      const { result } = renderHook(() => useScrollToBottom());
      result.current.containerRef.current = null;

      let returnValue;
      act(() => {
        returnValue = result.current.checkIfAtBottom();
      });

      // Should return the current isAtBottom value (true by default)
      expect(returnValue).toBe(true);
    });
  });

  describe("handleScroll", () => {
    it("should call checkIfAtBottom when invoked", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 500,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.handleScroll();
      });

      // isAtBottom should be updated based on scroll position
      expect(result.current.isAtBottom).toBe(false);
    });

    it("should update isAtBottom when scrolled to bottom", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 900,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(true);
    });
  });

  describe("auto-scroll behavior", () => {
    it("should scroll to bottom on initial mount", () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      const { result } = renderHook(() => useScrollToBottom());

      result.current.bottomRef.current = mockElement;

      // Need to advance timers to trigger the delayed scroll
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // Note: On mount, it uses 'instant' behavior
      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it("should auto-scroll when dependencies change and isAtBottom is true", () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps, { autoScroll: true }),
        { initialProps: { deps: [1] } },
      );

      result.current.bottomRef.current = mockElement;

      // Clear mock calls from initial mount
      mockElement.scrollIntoView.mockClear();

      // Change dependencies
      rerender({ deps: [2] });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it("should not auto-scroll when autoScroll is false", () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps, { autoScroll: false }),
        { initialProps: { deps: [1] } },
      );

      result.current.bottomRef.current = mockElement;

      // Clear mock calls from initial mount
      mockElement.scrollIntoView.mockClear();

      // Set isAtBottom to true
      const mockContainer = {
        scrollTop: 900,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.checkIfAtBottom();
      });

      // Change dependencies
      rerender({ deps: [2] });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
    });

    it("should not auto-scroll when isAtBottom is false", () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps, { autoScroll: true }),
        { initialProps: { deps: [1] } },
      );

      result.current.bottomRef.current = mockElement;

      // Set isAtBottom to false
      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.checkIfAtBottom();
      });

      // Clear mock calls
      mockElement.scrollIntoView.mockClear();

      // Change dependencies
      rerender({ deps: [2] });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(mockElement.scrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe("options", () => {
    it("should default autoScroll to true", () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps),
        { initialProps: { deps: [1] } },
      );

      result.current.bottomRef.current = mockElement;
      mockElement.scrollIntoView.mockClear();

      rerender({ deps: [2] });

      act(() => {
        vi.advanceTimersByTime(50);
      });

      // Should auto-scroll since autoScroll defaults to true
      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it("should default behavior to smooth", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
      });
    });

    it("should accept custom behavior option", () => {
      const { result } = renderHook(() =>
        useScrollToBottom([], { behavior: "auto" }),
      );

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "auto",
      });
    });
  });

  describe("dependencies array", () => {
    it("should handle empty dependencies array", () => {
      const { result } = renderHook(() => useScrollToBottom([]));
      expect(result.current).toBeDefined();
    });

    it("should handle undefined dependencies", () => {
      const { result } = renderHook(() => useScrollToBottom());
      expect(result.current).toBeDefined();
    });

    it("should handle dependencies with objects", () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps),
        { initialProps: { deps: [{ id: 1 }] } },
      );

      expect(() => {
        rerender({ deps: [{ id: 2 }] });
      }).not.toThrow();

      expect(result.current).toBeDefined();
    });

    it("should handle dependencies with arrays", () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useScrollToBottom(deps),
        { initialProps: { deps: [[1, 2, 3]] } },
      );

      expect(() => {
        rerender({ deps: [[1, 2, 3, 4]] });
      }).not.toThrow();

      expect(result.current).toBeDefined();
    });
  });

  describe("cleanup", () => {
    it("should clear timeout on unmount", () => {
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

      const { result, unmount } = renderHook(() => useScrollToBottom([1]));

      result.current.bottomRef.current = {
        scrollIntoView: vi.fn(),
      };

      unmount();

      // The hook should clean up its timeout
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it("should handle rapid mount/unmount without errors", () => {
      expect(() => {
        for (let i = 0; i < 5; i++) {
          const { unmount } = renderHook(() => useScrollToBottom());
          unmount();
        }
      }).not.toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle container with zero height", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      // 0 - 0 - 0 = 0 < 100, so should be at bottom
      expect(isAtBottom).toBe(true);
    });

    it("should handle negative scroll values", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: -10,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      // 1000 - (-10) - 100 = 910 >= 100, so not at bottom
      expect(isAtBottom).toBe(false);
    });

    it("should handle very large scroll values", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 999999900,
        scrollHeight: 1000000000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      let isAtBottom;
      act(() => {
        isAtBottom = result.current.checkIfAtBottom();
      });

      // 1000000000 - 999999900 - 100 = 0 < 100
      expect(isAtBottom).toBe(true);
    });
  });

  describe("multiple calls", () => {
    it("should handle multiple scrollToBottom calls", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockElement = {
        scrollIntoView: vi.fn(),
      };
      result.current.bottomRef.current = mockElement;

      act(() => {
        result.current.scrollToBottom();
        result.current.scrollToBottom();
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollIntoView).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple checkIfAtBottom calls", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 900,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.checkIfAtBottom();
        result.current.checkIfAtBottom();
        result.current.checkIfAtBottom();
      });

      expect(result.current.isAtBottom).toBe(true);
    });

    it("should handle multiple handleScroll calls", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 900,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.handleScroll();
        result.current.handleScroll();
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(true);
    });
  });

  describe("state transitions", () => {
    it("should transition from at bottom to not at bottom", () => {
      const { result } = renderHook(() => useScrollToBottom());

      // Initially at bottom
      expect(result.current.isAtBottom).toBe(true);

      // Scroll up
      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(false);
    });

    it("should transition from not at bottom to at bottom", () => {
      const { result } = renderHook(() => useScrollToBottom());

      // First, scroll up
      const mockContainer = {
        scrollTop: 0,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(false);

      // Then scroll to bottom
      mockContainer.scrollTop = 900;

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(true);
    });
  });

  describe("integration with scroll events", () => {
    it("should work as expected when used with actual scroll events", () => {
      const { result } = renderHook(() => useScrollToBottom());

      const mockContainer = {
        scrollTop: 500,
        scrollHeight: 1000,
        clientHeight: 100,
      };
      result.current.containerRef.current = mockContainer;

      // Simulate scroll event handler being called
      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(false);

      // Simulate scrolling to bottom
      mockContainer.scrollTop = 850;

      act(() => {
        result.current.handleScroll();
      });

      expect(result.current.isAtBottom).toBe(true);
    });
  });
});
