import { useRef, useCallback, useEffect, useState } from "react";

/**
 * Custom hook for scrolling to bottom of a container
 * Useful for chat messages and other scrollable lists
 *
 * @param {Array} dependencies - Array of dependencies that trigger auto-scroll
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoScroll - Whether to auto-scroll on dependency change (default: true)
 * @param {string} options.behavior - Scroll behavior: 'smooth' | 'instant' | 'auto' (default: 'smooth')
 * @returns {Object} { ref, scrollToBottom, isAtBottom }
 */
function useScrollToBottom(dependencies = [], options = {}) {
  const { autoScroll = true, behavior = "smooth" } = options;

  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  // Use state instead of ref for isAtBottom so it can be safely returned
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom function
  const scrollToBottom = useCallback(
    (scrollBehavior = behavior) => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: scrollBehavior });
      }
    },
    [behavior],
  );

  // Check if user is at bottom of container
  const checkIfAtBottom = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Consider "at bottom" if within 100px of the bottom
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsAtBottom(atBottom);
      return atBottom;
    }
    return isAtBottom;
  }, [isAtBottom]);

  // Handle scroll event to track position
  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // Auto-scroll when dependencies change
  useEffect(() => {
    if (autoScroll && isAtBottom) {
      // Small delay to ensure DOM has updated
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
    // Using JSON.stringify for dependencies array to avoid spread in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(dependencies), autoScroll, isAtBottom, scrollToBottom]);

  // Scroll to bottom on initial mount
  useEffect(() => {
    scrollToBottom("instant");
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Ref to attach to the element at the bottom of the list
    bottomRef,
    // Ref to attach to the scrollable container (optional, for tracking scroll position)
    containerRef,
    // Function to manually scroll to bottom
    scrollToBottom,
    // Function to check if currently at bottom
    checkIfAtBottom,
    // Handler for scroll events
    handleScroll,
    // Whether currently at bottom
    isAtBottom,
  };
}

export default useScrollToBottom;
