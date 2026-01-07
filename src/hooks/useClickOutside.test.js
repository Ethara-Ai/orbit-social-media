/**
 * Unit Tests for useClickOutside Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import useClickOutside from "./useClickOutside";

describe("useClickOutside", () => {
  let handler;

  beforeEach(() => {
    handler = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("return value", () => {
    it("should return a ref object", () => {
      const { result } = renderHook(() => useClickOutside(handler));
      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty("current");
    });

    it("should return ref with initial value of null", () => {
      const { result } = renderHook(() => useClickOutside(handler));
      expect(result.current.current).toBeNull();
    });
  });

  describe("click outside behavior", () => {
    it("should call handler when clicking outside the referenced element", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      // Create a div and attach the ref
      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Click outside (on document body)
      fireEvent.mouseDown(document.body);

      expect(handler).toHaveBeenCalledTimes(1);

      // Cleanup
      document.body.removeChild(div);
    });

    it("should not call handler when clicking inside the referenced element", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      // Create a div and attach the ref
      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Click inside the div
      fireEvent.mouseDown(div);

      expect(handler).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(div);
    });

    it("should not call handler when clicking on child elements", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      // Create a div with a child
      const div = document.createElement("div");
      const childButton = document.createElement("button");
      div.appendChild(childButton);
      document.body.appendChild(div);
      result.current.current = div;

      // Click on child element
      fireEvent.mouseDown(childButton);

      expect(handler).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(div);
    });

    it("should handle touch events (touchstart)", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Touch outside
      fireEvent.touchStart(document.body);

      expect(handler).toHaveBeenCalledTimes(1);

      // Cleanup
      document.body.removeChild(div);
    });

    it("should not call handler on touch inside the element", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Touch inside
      fireEvent.touchStart(div);

      expect(handler).not.toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(div);
    });
  });

  describe("escape key behavior", () => {
    it("should call handler when Escape key is pressed", () => {
      renderHook(() => useClickOutside(handler));

      fireEvent.keyDown(document, { key: "Escape" });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("should not call handler for other keys", () => {
      renderHook(() => useClickOutside(handler));

      fireEvent.keyDown(document, { key: "Enter" });
      fireEvent.keyDown(document, { key: "Tab" });
      fireEvent.keyDown(document, { key: "Space" });
      fireEvent.keyDown(document, { key: "a" });

      expect(handler).not.toHaveBeenCalled();
    });

    it("should pass event to handler on Escape", () => {
      renderHook(() => useClickOutside(handler));

      fireEvent.keyDown(document, { key: "Escape" });

      expect(handler).toHaveBeenCalledWith(expect.any(Object));
      expect(handler.mock.calls[0][0].key).toBe("Escape");
    });
  });

  describe("enabled prop", () => {
    it("should be enabled by default", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      fireEvent.mouseDown(document.body);

      expect(handler).toHaveBeenCalledTimes(1);

      document.body.removeChild(div);
    });

    it("should not call handler when disabled", () => {
      const { result } = renderHook(() => useClickOutside(handler, false));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      fireEvent.mouseDown(document.body);

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it("should not respond to Escape key when disabled", () => {
      renderHook(() => useClickOutside(handler, false));

      fireEvent.keyDown(document, { key: "Escape" });

      expect(handler).not.toHaveBeenCalled();
    });

    it("should not respond to touch events when disabled", () => {
      const { result } = renderHook(() => useClickOutside(handler, false));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      fireEvent.touchStart(document.body);

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it("should respond after being re-enabled", () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useClickOutside(handler, enabled),
        { initialProps: { enabled: false } },
      );

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Initially disabled
      fireEvent.mouseDown(document.body);
      expect(handler).not.toHaveBeenCalled();

      // Re-enable
      rerender({ enabled: true });

      fireEvent.mouseDown(document.body);
      expect(handler).toHaveBeenCalledTimes(1);

      document.body.removeChild(div);
    });

    it("should stop responding after being disabled", () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useClickOutside(handler, enabled),
        { initialProps: { enabled: true } },
      );

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // Initially enabled
      fireEvent.mouseDown(document.body);
      expect(handler).toHaveBeenCalledTimes(1);

      // Disable
      rerender({ enabled: false });

      fireEvent.mouseDown(document.body);
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not called again

      document.body.removeChild(div);
    });
  });

  describe("event listener cleanup", () => {
    it("should remove event listeners on unmount", () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      const { unmount } = renderHook(() => useClickOutside(handler));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "touchstart",
        expect.any(Function),
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it("should not have memory leaks with rapid mount/unmount", () => {
      const addEventListenerSpy = vi.spyOn(document, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      for (let i = 0; i < 5; i++) {
        const { unmount } = renderHook(() => useClickOutside(handler));
        unmount();
      }

      // Each mount adds 3 listeners, each unmount removes 3
      // After 5 cycles, we should have balanced adds and removes
      const addCalls = addEventListenerSpy.mock.calls.length;
      const removeCalls = removeEventListenerSpy.mock.calls.length;

      expect(addCalls).toBe(removeCalls);

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe("handler changes", () => {
    it("should use the latest handler", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ handler }) => useClickOutside(handler),
        { initialProps: { handler: handler1 } },
      );

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      // First handler
      fireEvent.mouseDown(document.body);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).not.toHaveBeenCalled();

      // Update handler
      rerender({ handler: handler2 });

      fireEvent.mouseDown(document.body);
      expect(handler1).toHaveBeenCalledTimes(1); // Not called again
      expect(handler2).toHaveBeenCalledTimes(1);

      document.body.removeChild(div);
    });
  });

  describe("ref not attached", () => {
    it("should not call handler when ref is not attached to any element", () => {
      renderHook(() => useClickOutside(handler));

      // ref.current is null, so the condition ref.current && !ref.current.contains()
      // evaluates to false and handler should not be called
      fireEvent.mouseDown(document.body);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe("multiple instances", () => {
    it("should handle multiple hooks independently", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const { result: result1 } = renderHook(() => useClickOutside(handler1));
      const { result: result2 } = renderHook(() => useClickOutside(handler2));

      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      document.body.appendChild(div1);
      document.body.appendChild(div2);

      result1.current.current = div1;
      result2.current.current = div2;

      // Click on div1 - outside div2
      fireEvent.mouseDown(div1);

      expect(handler1).not.toHaveBeenCalled(); // Inside div1
      expect(handler2).toHaveBeenCalledTimes(1); // Outside div2

      // Reset
      handler1.mockClear();
      handler2.mockClear();

      // Click on div2 - outside div1
      fireEvent.mouseDown(div2);

      expect(handler1).toHaveBeenCalledTimes(1); // Outside div1
      expect(handler2).not.toHaveBeenCalled(); // Inside div2

      document.body.removeChild(div1);
      document.body.removeChild(div2);
    });
  });

  describe("event object", () => {
    it("should pass event object to handler on click outside", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      fireEvent.mouseDown(document.body);

      expect(handler).toHaveBeenCalledWith(expect.any(Object));
      expect(handler.mock.calls[0][0].type).toBe("mousedown");

      document.body.removeChild(div);
    });

    it("should pass event object to handler on touch outside", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const div = document.createElement("div");
      document.body.appendChild(div);
      result.current.current = div;

      fireEvent.touchStart(document.body);

      expect(handler).toHaveBeenCalledWith(expect.any(Object));
      expect(handler.mock.calls[0][0].type).toBe("touchstart");

      document.body.removeChild(div);
    });
  });

  describe("nested elements", () => {
    it("should handle deeply nested click targets", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      // Create nested structure: div > span > button
      const div = document.createElement("div");
      const span = document.createElement("span");
      const button = document.createElement("button");

      span.appendChild(button);
      div.appendChild(span);
      document.body.appendChild(div);

      result.current.current = div;

      // Click on deeply nested button
      fireEvent.mouseDown(button);

      expect(handler).not.toHaveBeenCalled();

      document.body.removeChild(div);
    });

    it("should detect click outside when clicking sibling element", () => {
      const { result } = renderHook(() => useClickOutside(handler));

      const container = document.createElement("div");
      const targetDiv = document.createElement("div");
      const siblingDiv = document.createElement("div");

      container.appendChild(targetDiv);
      container.appendChild(siblingDiv);
      document.body.appendChild(container);

      result.current.current = targetDiv;

      // Click on sibling
      fireEvent.mouseDown(siblingDiv);

      expect(handler).toHaveBeenCalledTimes(1);

      document.body.removeChild(container);
    });
  });
});
