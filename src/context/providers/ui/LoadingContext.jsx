/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { LOADING_DURATION } from '../../../utils/constants';

// ============================================================================
// Context Definition
// ============================================================================

const LoadingContext = createContext(null);
LoadingContext.displayName = 'LoadingContext';

// ============================================================================
// Loading Provider
// Focused provider for app loading state
//
// Responsibilities:
// - Initial app loading state
// - Loading screen timer management
// ============================================================================

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading]
  );

  return <LoadingContext.Provider value={contextValue}>{children}</LoadingContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export default LoadingContext;
