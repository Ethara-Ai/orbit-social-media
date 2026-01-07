import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook for responsive design using CSS media queries
 * @param {string} query - The media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
function useMediaQuery(query) {
  // Create media query list once per query
  const mediaQueryList = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.matchMedia(query);
  }, [query]);

  // Use lazy initializer to get initial value
  const [matches, setMatches] = useState(() => {
    if (mediaQueryList) {
      return mediaQueryList.matches;
    }
    return false;
  });

  useEffect(() => {
    if (!mediaQueryList) {
      return;
    }

    // Update state to match current value when query changes
    // This is safe because it only runs when the query prop changes
    setMatches(mediaQueryList.matches);

    // Create event listener function that updates state
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Add event listener using the modern API with fallback
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQueryList.removeListener(handleChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaQueryList]);

  return matches;
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
