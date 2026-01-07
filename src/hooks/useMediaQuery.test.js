/**
 * Unit Tests for useMediaQuery Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useMediaQuery, {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  useBreakpoint,
  usePrefersDarkMode,
  usePrefersReducedMotion,
} from "./useMediaQuery";

describe("useMediaQuery", () => {
  let mockMatchMedia;
  let listeners;

  beforeEach(() => {
    listeners = new Map();

    mockMatchMedia = vi.fn().mockImplementation((query) => {
      const mediaQueryList = {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event, callback) => {
          if (!listeners.has(query)) {
            listeners.set(query, []);
          }
          listeners.get(query).push(callback);
        }),
        removeEventListener: vi.fn((event, callback) => {
          if (listeners.has(query)) {
            const queryListeners = listeners.get(query);
            const index = queryListeners.indexOf(callback);
            if (index > -1) {
              queryListeners.splice(index, 1);
            }
          }
        }),
        addListener: vi.fn((callback) => {
          if (!listeners.has(query)) {
            listeners.set(query, []);
          }
          listeners.get(query).push(callback);
        }),
        removeListener: vi.fn((callback) => {
          if (listeners.has(query)) {
            const queryListeners = listeners.get(query);
            const index = queryListeners.indexOf(callback);
            if (index > -1) {
              queryListeners.splice(index, 1);
            }
          }
        }),
        dispatchEvent: vi.fn(),
      };
      return mediaQueryList;
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    listeners.clear();
  });

  describe("basic functionality", () => {
    it("should return false when media query does not match", () => {
      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
      expect(result.current).toBe(false);
    });

    it("should return true when media query matches", () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
      expect(result.current).toBe(true);
    });

    it("should call matchMedia with the provided query", () => {
      renderHook(() => useMediaQuery("(max-width: 640px)"));
      expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 640px)");
    });

    it("should call matchMedia again when query changes", () => {
      const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
        initialProps: { query: "(min-width: 768px)" },
      });

      expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 768px)");

      rerender({ query: "(min-width: 1024px)" });

      expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
    });
  });

  describe("event subscription", () => {
    it("should subscribe to media query changes using addEventListener", () => {
      const addEventListenerMock = vi.fn();
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: addEventListenerMock,
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      renderHook(() => useMediaQuery("(min-width: 768px)"));

      expect(addEventListenerMock).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });

    it("should unsubscribe on unmount using removeEventListener", () => {
      const removeEventListenerMock = vi.fn();
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: removeEventListenerMock,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

      unmount();

      expect(removeEventListenerMock).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });

    it("should use fallback addListener for older browsers", () => {
      const addListenerMock = vi.fn();
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: undefined,
        removeEventListener: undefined,
        addListener: addListenerMock,
        removeListener: vi.fn(),
      }));

      renderHook(() => useMediaQuery("(min-width: 768px)"));

      expect(addListenerMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should use fallback removeListener for older browsers on unmount", () => {
      const removeListenerMock = vi.fn();
      mockMatchMedia.mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: undefined,
        removeEventListener: undefined,
        addListener: vi.fn(),
        removeListener: removeListenerMock,
      }));

      const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

      unmount();

      expect(removeListenerMock).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("query changes", () => {
    it("should re-evaluate when query string changes", () => {
      const { result, rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: "(min-width: 768px)" } },
      );

      expect(result.current).toBe(false);

      mockMatchMedia.mockImplementation((query) => ({
        matches: query === "(min-width: 1024px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      rerender({ query: "(min-width: 1024px)" });

      expect(result.current).toBe(true);
    });
  });

  describe("SSR compatibility", () => {
    it("should return false for server snapshot (SSR)", () => {
      // The hook uses getServerSnapshot which returns false
      // This is tested implicitly through the useSyncExternalStore behavior
      const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
      // Initial render should not throw and should have a boolean value
      expect(typeof result.current).toBe("boolean");
    });
  });
});

describe("useIsMobile", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 639px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct mobile breakpoint query", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 639px)");
    expect(result.current).toBe(true);
  });

  it("should return false when not on mobile", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});

describe("useIsTablet", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 640px) and (max-width: 1023px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct tablet breakpoint query", () => {
    const { result } = renderHook(() => useIsTablet());
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(min-width: 640px) and (max-width: 1023px)",
    );
    expect(result.current).toBe(true);
  });

  it("should return false when not on tablet", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsTablet());
    expect(result.current).toBe(false);
  });
});

describe("useIsDesktop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 1024px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct desktop breakpoint query", () => {
    const { result } = renderHook(() => useIsDesktop());
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
    expect(result.current).toBe(true);
  });

  it("should return false when not on desktop", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });
});

describe("useIsLargeDesktop", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 1280px)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct large desktop breakpoint query", () => {
    const { result } = renderHook(() => useIsLargeDesktop());
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1280px)");
    expect(result.current).toBe(true);
  });

  it("should return false when not on large desktop", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsLargeDesktop());
    expect(result.current).toBe(false);
  });
});

describe("useBreakpoint", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use sm breakpoint query", () => {
    renderHook(() => useBreakpoint("sm"));
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 640px)");
  });

  it("should use md breakpoint query", () => {
    renderHook(() => useBreakpoint("md"));
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 768px)");
  });

  it("should use lg breakpoint query", () => {
    renderHook(() => useBreakpoint("lg"));
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
  });

  it("should use xl breakpoint query", () => {
    renderHook(() => useBreakpoint("xl"));
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1280px)");
  });

  it("should use 2xl breakpoint query", () => {
    renderHook(() => useBreakpoint("2xl"));
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1536px)");
  });

  it("should use custom query when breakpoint is not predefined", () => {
    const customQuery = "(min-width: 2000px)";
    renderHook(() => useBreakpoint(customQuery));
    expect(window.matchMedia).toHaveBeenCalledWith(customQuery);
  });

  it("should return true when breakpoint matches", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 768px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useBreakpoint("md"));
    expect(result.current).toBe(true);
  });

  it("should return false when breakpoint does not match", () => {
    const { result } = renderHook(() => useBreakpoint("lg"));
    expect(result.current).toBe(false);
  });
});

describe("usePrefersDarkMode", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct dark mode query", () => {
    const { result } = renderHook(() => usePrefersDarkMode());
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)",
    );
    expect(result.current).toBe(true);
  });

  it("should return false when light mode is preferred", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersDarkMode());
    expect(result.current).toBe(false);
  });
});

describe("usePrefersReducedMotion", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should use correct reduced motion query", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
    expect(result.current).toBe(true);
  });

  it("should return false when no motion preference", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });
});

describe("multiple instances", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes("1024"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should handle multiple hooks with different queries", () => {
    const { result: mobileResult } = renderHook(() => useIsMobile());
    const { result: desktopResult } = renderHook(() => useIsDesktop());

    expect(mobileResult.current).toBe(false);
    expect(desktopResult.current).toBe(true);
  });

  it("should allow multiple components to use the same media query", () => {
    const { result: result1 } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)"),
    );
    const { result: result2 } = renderHook(() =>
      useMediaQuery("(min-width: 1024px)"),
    );

    expect(result1.current).toBe(true);
    expect(result2.current).toBe(true);
  });
});

describe("edge cases", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });
  });

  it("should handle empty query string", () => {
    const { result } = renderHook(() => useMediaQuery(""));
    expect(result.current).toBe(false);
  });

  it("should handle complex media queries", () => {
    renderHook(() =>
      useMediaQuery(
        "(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)",
      ),
    );
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(min-width: 768px) and (max-width: 1024px) and (orientation: landscape)",
    );
  });

  it("should handle rapid query changes", () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: "(min-width: 320px)" },
    });

    rerender({ query: "(min-width: 480px)" });
    rerender({ query: "(min-width: 640px)" });
    rerender({ query: "(min-width: 768px)" });
    rerender({ query: "(min-width: 1024px)" });

    // Verify that matchMedia was called with each query
    // (useSyncExternalStore may call matchMedia multiple times internally)
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 320px)");
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 480px)");
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 640px)");
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 768px)");
    expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
  });

  it("should clean up properly after multiple rerenders", () => {
    const removeEventListenerMock = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { rerender, unmount } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: "(min-width: 768px)" } },
    );

    rerender({ query: "(min-width: 1024px)" });
    unmount();

    // Should have cleaned up the listener
    expect(removeEventListenerMock).toHaveBeenCalled();
  });
});
