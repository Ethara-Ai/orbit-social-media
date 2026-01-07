import { useCallback, useSyncExternalStore } from "react";

/**
 * Custom hook for responsive design using CSS media queries
 * Uses useSyncExternalStore for safe subscription to media query changes
 * @param {string} query - The media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
function useMediaQuery(query) {
  // For SSR compatibility, return false during server render
  const getServerSnapshot = useCallback(() => false, []);

  // Get the current snapshot of the media query
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  }, [query]);

  // Subscribe to media query changes
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const mediaQueryList = window.matchMedia(query);

      // Add event listener using the modern API with fallback
      if (mediaQueryList.addEventListener) {
        mediaQueryList.addEventListener("change", callback);
      } else {
        // Fallback for older browsers
        mediaQueryList.addListener(callback);
      }

      // Cleanup
      return () => {
        if (mediaQueryList.removeEventListener) {
          mediaQueryList.removeEventListener("change", callback);
        } else {
          // Fallback for older browsers
          mediaQueryList.removeListener(callback);
        }
      };
    },
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Predefined breakpoint hooks for convenience
export const useIsMobile = () => useMediaQuery("(max-width: 639px)");
export const useIsTablet = () =>
  useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsLargeDesktop = () => useMediaQuery("(min-width: 1280px)");

// Tailwind CSS breakpoints
export const useBreakpoint = (breakpoint) => {
  const breakpoints = {
    sm: "(min-width: 640px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    "2xl": "(min-width: 1536px)",
  };

  return useMediaQuery(breakpoints[breakpoint] || breakpoint);
};

// Preference queries
export const usePrefersDarkMode = () =>
  useMediaQuery("(prefers-color-scheme: dark)");
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

export default useMediaQuery;
