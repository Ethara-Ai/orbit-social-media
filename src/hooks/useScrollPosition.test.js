/**
 * Unit Tests for useScrollPosition Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useScrollPosition from "./useScrollPosition";
import { TABS } from "../utils/constants";

describe("useScrollPosition", () => {
  let mockRequestAnimationFrame;

  beforeEach(() => {
    mockRequestAnimationFrame = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        callback();
        return 1;
      });
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockRequestAnimationFrame.mockRestore();
  });

  describe("return values", () => {
    it("should return saveScrollPosition function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.saveScrollPosition).toBe("function");
    });

    it("should return restoreScrollPosition function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.restoreScrollPosition).toBe("function");
    });

    it("should return registerScrollContainer function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.registerScrollContainer).toBe("function");
    });

    it("should return getScrollContainer function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.getScrollContainer).toBe("function");
    });

    it("should return resetScrollPosition function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.resetScrollPosition).toBe("function");
    });

    it("should return resetAllScrollPositions function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.resetAllScrollPositions).toBe("function");
    });

    it("should return createScrollHandler function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.createScrollHandler).toBe("function");
    });

    it("should return getScrollPositions function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(typeof result.current.getScrollPositions).toBe("function");
    });
  });

  describe("registerScrollContainer", () => {
    it("should return a ref callback function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      const refCallback = result.current.registerScrollContainer(TABS.FEED);
      expect(typeof refCallback).toBe("function");
    });

    it("should register an element for a tab", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      const refCallback = result.current.registerScrollContainer(TABS.FEED);

      act(() => {
        refCallback(mockElement);
      });

      expect(result.current.getScrollContainer(TABS.FEED)).toBe(mockElement);
    });

    it("should register different elements for different tabs", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const feedElement = document.createElement("div");
      const exploreElement = document.createElement("div");

      const feedRefCallback = result.current.registerScrollContainer(TABS.FEED);
      const exploreRefCallback = result.current.registerScrollContainer(TABS.EXPLORE);

      act(() => {
        feedRefCallback(feedElement);
        exploreRefCallback(exploreElement);
      });

      expect(result.current.getScrollContainer(TABS.FEED)).toBe(feedElement);
      expect(result.current.getScrollContainer(TABS.EXPLORE)).toBe(exploreElement);
    });

    it("should handle null element registration", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const refCallback = result.current.registerScrollContainer(TABS.FEED);

      act(() => {
        refCallback(null);
      });

      expect(result.current.getScrollContainer(TABS.FEED)).toBeNull();
    });
  });

  describe("getScrollContainer", () => {
    it("should return null for unregistered tab", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      expect(result.current.getScrollContainer(TABS.FEED)).toBeNull();
    });

    it("should return the registered element", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      const refCallback = result.current.registerScrollContainer(TABS.MESSAGES);

      act(() => {
        refCallback(mockElement);
      });

      expect(result.current.getScrollContainer(TABS.MESSAGES)).toBe(mockElement);
    });
  });

  describe("saveScrollPosition", () => {
    it("should save the scroll position of a tab", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      Object.defineProperty(mockElement, "scrollTop", {
        value: 500,
        writable: true,
      });

      const refCallback = result.current.registerScrollContainer(TABS.FEED);

      act(() => {
        refCallback(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(500);
    });

    it("should not throw when container is null", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      expect(() => {
        act(() => {
          result.current.saveScrollPosition(TABS.FEED);
        });
      }).not.toThrow();
    });

    it("should save different positions for different tabs", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const feedElement = document.createElement("div");
      const exploreElement = document.createElement("div");

      Object.defineProperty(feedElement, "scrollTop", {
        value: 100,
        writable: true,
      });
      Object.defineProperty(exploreElement, "scrollTop", {
        value: 200,
        writable: true,
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
        result.current.registerScrollContainer(TABS.EXPLORE)(exploreElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
        result.current.saveScrollPosition(TABS.EXPLORE);
      });

      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(100);
      expect(positions[TABS.EXPLORE]).toBe(200);
    });

    it("should overwrite previous saved position", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 100;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(100);

      // Simulate scrolling
      scrollTopValue = 300;

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(300);
    });
  });

  describe("restoreScrollPosition", () => {
    it("should restore scroll position using requestAnimationFrame", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 0;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      // Manually set a saved position
      scrollTopValue = 500;
      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      // Reset scroll
      scrollTopValue = 0;

      act(() => {
        result.current.restoreScrollPosition(TABS.FEED);
      });

      expect(mockRequestAnimationFrame).toHaveBeenCalled();
      expect(scrollTopValue).toBe(500);
    });

    it("should not throw when container is null", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      expect(() => {
        act(() => {
          result.current.restoreScrollPosition(TABS.FEED);
        });
      }).not.toThrow();
    });

    it("should restore to 0 for tab with no saved position", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 100;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.EXPLORE)(mockElement);
      });

      act(() => {
        result.current.restoreScrollPosition(TABS.EXPLORE);
      });

      expect(scrollTopValue).toBe(0);
    });
  });

  describe("resetScrollPosition", () => {
    it("should reset scroll position to 0 for a specific tab", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 500;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      // Save a position first
      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(500);

      // Reset
      act(() => {
        result.current.resetScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(0);
      expect(scrollTopValue).toBe(0);
    });

    it("should only reset the specified tab", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const feedElement = document.createElement("div");
      const exploreElement = document.createElement("div");

      let feedScrollTop = 100;
      let exploreScrollTop = 200;

      Object.defineProperty(feedElement, "scrollTop", {
        get: () => feedScrollTop,
        set: (val) => {
          feedScrollTop = val;
        },
      });
      Object.defineProperty(exploreElement, "scrollTop", {
        get: () => exploreScrollTop,
        set: (val) => {
          exploreScrollTop = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
        result.current.registerScrollContainer(TABS.EXPLORE)(exploreElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
        result.current.saveScrollPosition(TABS.EXPLORE);
      });

      act(() => {
        result.current.resetScrollPosition(TABS.FEED);
      });

      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(0);
      expect(positions[TABS.EXPLORE]).toBe(200);
    });

    it("should not throw when container is null", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      expect(() => {
        act(() => {
          result.current.resetScrollPosition(TABS.FEED);
        });
      }).not.toThrow();
    });
  });

  describe("resetAllScrollPositions", () => {
    it("should reset all scroll positions to 0", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const feedElement = document.createElement("div");
      const exploreElement = document.createElement("div");
      const messagesElement = document.createElement("div");

      let feedScrollTop = 100;
      let exploreScrollTop = 200;
      let messagesScrollTop = 300;

      Object.defineProperty(feedElement, "scrollTop", {
        get: () => feedScrollTop,
        set: (val) => {
          feedScrollTop = val;
        },
      });
      Object.defineProperty(exploreElement, "scrollTop", {
        get: () => exploreScrollTop,
        set: (val) => {
          exploreScrollTop = val;
        },
      });
      Object.defineProperty(messagesElement, "scrollTop", {
        get: () => messagesScrollTop,
        set: (val) => {
          messagesScrollTop = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
        result.current.registerScrollContainer(TABS.EXPLORE)(exploreElement);
        result.current.registerScrollContainer(TABS.MESSAGES)(messagesElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
        result.current.saveScrollPosition(TABS.EXPLORE);
        result.current.saveScrollPosition(TABS.MESSAGES);
      });

      act(() => {
        result.current.resetAllScrollPositions();
      });

      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(0);
      expect(positions[TABS.EXPLORE]).toBe(0);
      expect(positions[TABS.MESSAGES]).toBe(0);

      expect(feedScrollTop).toBe(0);
      expect(exploreScrollTop).toBe(0);
      expect(messagesScrollTop).toBe(0);
    });

    it("should handle containers that are null", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      expect(() => {
        act(() => {
          result.current.resetAllScrollPositions();
        });
      }).not.toThrow();
    });
  });

  describe("createScrollHandler", () => {
    it("should return a scroll handler function", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      const handler = result.current.createScrollHandler(TABS.FEED);
      expect(typeof handler).toBe("function");
    });

    it("should update scroll position when handler is called", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 0;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      const handler = result.current.createScrollHandler(TABS.FEED);

      // Simulate scroll
      scrollTopValue = 250;

      act(() => {
        handler();
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(250);
    });

    it("should track continuous scrolling", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 0;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      const handler = result.current.createScrollHandler(TABS.FEED);

      // Simulate continuous scrolling
      scrollTopValue = 100;
      act(() => {
        handler();
      });
      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(100);

      scrollTopValue = 200;
      act(() => {
        handler();
      });
      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(200);

      scrollTopValue = 300;
      act(() => {
        handler();
      });
      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(300);
    });

    it("should not throw when container is null", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const handler = result.current.createScrollHandler(TABS.FEED);

      expect(() => {
        act(() => {
          handler();
        });
      }).not.toThrow();
    });
  });

  describe("getScrollPositions", () => {
    it("should return initial scroll positions as 0", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));
      const positions = result.current.getScrollPositions();

      expect(positions[TABS.FEED]).toBe(0);
      expect(positions[TABS.EXPLORE]).toBe(0);
      expect(positions[TABS.MESSAGES]).toBe(0);
      expect(positions[TABS.NOTIFICATIONS]).toBe(0);
    });

    it("should return a copy of scroll positions", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const positions1 = result.current.getScrollPositions();
      const positions2 = result.current.getScrollPositions();

      expect(positions1).not.toBe(positions2);
      expect(positions1).toEqual(positions2);
    });

    it("should return updated positions after saving", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      Object.defineProperty(mockElement, "scrollTop", {
        value: 750,
        writable: true,
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(750);
    });
  });

  describe("tab change behavior", () => {
    it("should save scroll position when switching away from a tab", () => {
      const feedElement = document.createElement("div");
      let feedScrollTop = 400;
      Object.defineProperty(feedElement, "scrollTop", {
        get: () => feedScrollTop,
        set: (val) => {
          feedScrollTop = val;
        },
      });

      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
      });

      // Change to a different tab
      rerender({ activeTab: TABS.EXPLORE });

      // The scroll position should have been saved
      const positions = result.current.getScrollPositions();
      expect(positions[TABS.FEED]).toBe(400);
    });

    it("should restore scroll position when switching to a tab", () => {
      const feedElement = document.createElement("div");
      const exploreElement = document.createElement("div");

      let feedScrollTop = 0;
      let exploreScrollTop = 0;

      Object.defineProperty(feedElement, "scrollTop", {
        get: () => feedScrollTop,
        set: (val) => {
          feedScrollTop = val;
        },
      });
      Object.defineProperty(exploreElement, "scrollTop", {
        get: () => exploreScrollTop,
        set: (val) => {
          exploreScrollTop = val;
        },
      });

      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
        result.current.registerScrollContainer(TABS.EXPLORE)(exploreElement);
      });

      // Scroll on feed
      feedScrollTop = 500;
      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      // Switch to explore
      rerender({ activeTab: TABS.EXPLORE });

      // Scroll on explore
      exploreScrollTop = 300;
      act(() => {
        result.current.saveScrollPosition(TABS.EXPLORE);
      });

      // Switch back to feed - should restore position
      rerender({ activeTab: TABS.FEED });

      expect(feedScrollTop).toBe(500);
    });

    it("should not save/restore when staying on the same tab", () => {
      const feedElement = document.createElement("div");
      let feedScrollTop = 100;
      Object.defineProperty(feedElement, "scrollTop", {
        get: () => feedScrollTop,
        set: (val) => {
          feedScrollTop = val;
        },
      });

      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(feedElement);
      });

      // Rerender with same tab
      rerender({ activeTab: TABS.FEED });

      // Position should remain unchanged
      expect(feedScrollTop).toBe(100);
    });
  });

  describe("stability of returned functions", () => {
    it("should return stable saveScrollPosition function", () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      const firstSave = result.current.saveScrollPosition;
      rerender({ activeTab: TABS.FEED });
      const secondSave = result.current.saveScrollPosition;

      expect(firstSave).toBe(secondSave);
    });

    it("should return stable restoreScrollPosition function", () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      const firstRestore = result.current.restoreScrollPosition;
      rerender({ activeTab: TABS.FEED });
      const secondRestore = result.current.restoreScrollPosition;

      expect(firstRestore).toBe(secondRestore);
    });

    it("should return stable registerScrollContainer function", () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      const firstRegister = result.current.registerScrollContainer;
      rerender({ activeTab: TABS.FEED });
      const secondRegister = result.current.registerScrollContainer;

      expect(firstRegister).toBe(secondRegister);
    });

    it("should return stable createScrollHandler function", () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      const firstCreate = result.current.createScrollHandler;
      rerender({ activeTab: TABS.FEED });
      const secondCreate = result.current.createScrollHandler;

      expect(firstCreate).toBe(secondCreate);
    });
  });

  describe("edge cases", () => {
    it("should handle rapid tab switching", () => {
      const { result, rerender } = renderHook(
        ({ activeTab }) => useScrollPosition(activeTab),
        { initialProps: { activeTab: TABS.FEED } }
      );

      expect(() => {
        rerender({ activeTab: TABS.EXPLORE });
        rerender({ activeTab: TABS.MESSAGES });
        rerender({ activeTab: TABS.NOTIFICATIONS });
        rerender({ activeTab: TABS.FEED });
      }).not.toThrow();
    });

    it("should handle zero scroll position", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      let scrollTopValue = 0;
      Object.defineProperty(mockElement, "scrollTop", {
        get: () => scrollTopValue,
        set: (val) => {
          scrollTopValue = val;
        },
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(0);
    });

    it("should handle large scroll positions", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      Object.defineProperty(mockElement, "scrollTop", {
        value: 999999,
        writable: true,
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(999999);
    });

    it("should handle decimal scroll positions", () => {
      const { result } = renderHook(() => useScrollPosition(TABS.FEED));

      const mockElement = document.createElement("div");
      Object.defineProperty(mockElement, "scrollTop", {
        value: 123.456,
        writable: true,
      });

      act(() => {
        result.current.registerScrollContainer(TABS.FEED)(mockElement);
      });

      act(() => {
        result.current.saveScrollPosition(TABS.FEED);
      });

      expect(result.current.getScrollPositions()[TABS.FEED]).toBe(123.456);
    });
  });

  describe("multiple hook instances", () => {
    it("should maintain independent state between instances", () => {
      const { result: result1 } = renderHook(() =>
        useScrollPosition(TABS.FEED)
      );
      const { result: result2 } = renderHook(() =>
        useScrollPosition(TABS.EXPLORE)
      );

      const element1 = document.createElement("div");
      const element2 = document.createElement("div");

      Object.defineProperty(element1, "scrollTop", {
        value: 100,
        writable: true,
      });
      Object.defineProperty(element2, "scrollTop", {
        value: 200,
        writable: true,
      });

      act(() => {
        result1.current.registerScrollContainer(TABS.FEED)(element1);
        result2.current.registerScrollContainer(TABS.EXPLORE)(element2);
      });

      act(() => {
        result1.current.saveScrollPosition(TABS.FEED);
        result2.current.saveScrollPosition(TABS.EXPLORE);
      });

      // Each instance should maintain its own state
      expect(result1.current.getScrollPositions()[TABS.FEED]).toBe(100);
      expect(result2.current.getScrollPositions()[TABS.EXPLORE]).toBe(200);
    });
  });
});
