/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';

// Import Data
import { trendingTopics } from '../../data/mockData';

// Import Utils
import { scrollToTop } from '../../utils/helpers';
import { LOADING_DURATION, TABS, COPY_NOTIFICATION_DURATION } from '../../utils/constants';

// ============================================================================
// Context Definition
// ============================================================================

const UIContext = createContext(null);

// ============================================================================
// UI Provider
// Self-contained provider managing UI-related state and actions
//
// Encapsulation Strategy:
// - UI control setters (tab, navigation, modals) are exposed to support
//   the application's UI interaction patterns
// - Actions (closeMobileNav, closeAllModals, toggleTheme) provide
//   convenient methods for common operations
// - Theme state management is encapsulated with both setter and toggle
// ============================================================================

export function UIProvider({ children }) {
  // ==========================================================================
  // UI State
  // ==========================================================================
  const [activeTab, setActiveTabState] = useState(TABS.FEED);
  const [previousTab, setPreviousTab] = useState(null);
  const [showFriends, setShowFriends] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobileRightSidebar, setShowMobileRightSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isTheaterModeOpen, setIsTheaterModeOpen] = useState(false);

  // Ref for copy notification timeout to prevent memory leaks
  const copyNotificationTimeoutRef = useRef(null);

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

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DURATION);
    return () => clearTimeout(timer);
  }, []);

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

  // Cleanup copy notification timeout on unmount
  useEffect(() => {
    return () => {
      if (copyNotificationTimeoutRef.current) {
        clearTimeout(copyNotificationTimeoutRef.current);
      }
    };
  }, []);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const isModalOpen = useMemo(
    () => showProfileModal || showCurrentUserModal || selectedPost !== null || isTheaterModeOpen,
    [showProfileModal, showCurrentUserModal, selectedPost, isTheaterModeOpen]
  );

  // Track if we're leaving the messages tab (used by MessagesTab to cleanup)
  const isLeavingMessagesTab = useMemo(
    () => previousTab === TABS.MESSAGES && activeTab !== TABS.MESSAGES,
    [previousTab, activeTab]
  );

  // ==========================================================================
  // UI Handlers
  // ==========================================================================

  const setActiveTab = useCallback(
    (newTab) => {
      setPreviousTab(activeTab);
      setActiveTabState(newTab);
      scrollToTop();
    },
    [activeTab]
  );

  const closeMobileNav = useCallback(() => {
    setShowMobileNav(false);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowProfileModal(false);
    setShowCurrentUserModal(false);
    setSelectedPost(null);
    setIsTheaterModeOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  /**
   * Show copy notification with automatic timeout cleanup
   * Prevents memory leaks by clearing previous timeouts
   */
  const showCopyNotificationWithTimeout = useCallback(() => {
    // Clear any existing timeout to prevent overlap
    if (copyNotificationTimeoutRef.current) {
      clearTimeout(copyNotificationTimeoutRef.current);
    }

    setShowCopyNotification(true);

    copyNotificationTimeoutRef.current = setTimeout(() => {
      setShowCopyNotification(false);
      copyNotificationTimeoutRef.current = null;
    }, COPY_NOTIFICATION_DURATION);
  }, []);

  const isDarkMode = theme === 'dark';

  // ==========================================================================
  // Context Value
  //
  // Exposed to consumers:
  // - Read-only data (activeTab, theme, computed states, etc.)
  // - UI control setters (for navigation, modals, overlays)
  // - Actions (convenient methods for common UI operations)
  //
  // All setters are intentionally exposed for this global UI state manager
  // as it serves as the central coordination point for application-wide UI
  // ============================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      activeTab,
      previousTab,
      showFriends,
      showMobileNav,
      showMobileRightSidebar,
      isLoading,
      showCopyNotification,
      showCurrentUserModal,
      showProfileModal,
      selectedPost,
      trendingTopics,
      isModalOpen,
      isLeavingMessagesTab,
      isTheaterModeOpen,
      theme,
      isDarkMode,
      // Navigation & Tab Control
      setActiveTab,
      // UI Visibility Setters
      setShowFriends,
      setShowMobileNav,
      setShowMobileRightSidebar,
      setIsLoading,
      setShowCopyNotification,
      // Modal & Overlay Setters
      setShowCurrentUserModal,
      setShowProfileModal,
      setSelectedPost,
      setIsTheaterModeOpen,
      // Theme Setters
      setTheme,
      // Actions (encapsulate common UI operations)
      closeMobileNav,
      closeAllModals,
      toggleTheme,
      showCopyNotificationWithTimeout,
    }),
    [
      activeTab,
      previousTab,
      showFriends,
      showMobileNav,
      showMobileRightSidebar,
      isLoading,
      showCopyNotification,
      showCurrentUserModal,
      showProfileModal,
      selectedPost,
      isModalOpen,
      isLeavingMessagesTab,
      isTheaterModeOpen,
      theme,
      isDarkMode,
      setActiveTab,
      closeMobileNav,
      closeAllModals,
      toggleTheme,
      setTheme,
      showCopyNotificationWithTimeout,
    ]
  );

  return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export default UIContext;
