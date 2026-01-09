/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

// ============================================================================
// Context Definition
// ============================================================================

const ThemeContext = createContext(null);
ThemeContext.displayName = 'ThemeContext';

// ============================================================================
// Theme Provider
// Focused provider managing only theme-related state
//
// Responsibilities:
// - Theme state (light/dark)
// - System preference detection
// - localStorage persistence
// - Document class management
// ============================================================================

export function ThemeProvider({ children }) {
  // Theme state - use lazy initializer to read from localStorage/system preference
  const [theme, setThemeState] = useState(() => {
    // Safe check for SSR
    if (typeof window === 'undefined') return 'light';

    try {
      const savedTheme = localStorage.getItem('orbit-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      // Check system preference
      if (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
        return 'dark';
      }
    } catch {
      // localStorage might not be available
    }
    return 'light';
  });

  // Apply theme to document whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      localStorage.setItem('orbit-theme', theme);
    } catch {
      // localStorage might not be available
    }
  }, [theme]);

  // ==========================================================================
  // Theme Handlers
  // ==========================================================================

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
    }
  }, []);

  const isDarkMode = theme === 'dark';

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      theme,
      isDarkMode,
      setTheme,
      toggleTheme,
    }),
    [theme, isDarkMode, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
