/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// ============================================================================
// Context Definition
// ============================================================================

const MobileNavContext = createContext(null);
MobileNavContext.displayName = 'MobileNavContext';

// ============================================================================
// Mobile Nav Provider
// Focused provider for mobile navigation state only
// This separation prevents re-renders in unrelated components
// ============================================================================

export function MobileNavProvider({ children }) {
  // ==========================================================================
  // Mobile Navigation State
  // ==========================================================================
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);

  // ==========================================================================
  // Actions
  // ==========================================================================

  const closeMobileNav = useCallback(() => {
    setShowMobileNav(false);
  }, []);

  const closeMobileRightSidebar = useCallback(() => {
    setShowMobileRightSidebar(false);
  }, []);

  const closeAllMobileOverlays = useCallback(() => {
    setShowMobileNav(false);
    setShowMobileRightSidebar(false);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // State
      showMobileNav,
      showMobileRightSidebar,
      // Setters
      setShowMobileNav,
      setShowMobileRightSidebar,
      // Actions
      closeMobileNav,
      closeMobileRightSidebar,
      closeAllMobileOverlays,
    }),
    [
      showMobileNav,
      showMobileRightSidebar,
      closeMobileNav,
      closeMobileRightSidebar,
      closeAllMobileOverlays,
    ]
  );

  return <MobileNavContext.Provider value={contextValue}>{children}</MobileNavContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useMobileNav() {
  const context = useContext(MobileNavContext);
  if (!context) {
    throw new Error('useMobileNav must be used within a MobileNavProvider');
  }
  return context;
}

export default MobileNavContext;
