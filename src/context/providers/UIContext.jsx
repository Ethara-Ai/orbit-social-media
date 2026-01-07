/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

// Import Data
import { trendingTopics } from "../../data/mockData";

// Import Utils
import { scrollToTop } from "../../utils/helpers";
import { LOADING_DURATION, TABS } from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const UIContext = createContext(null);

// ============================================================================
// UI Provider
// Self-contained provider managing UI-related state and actions
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

  // Theme state - use lazy initializer to read from localStorage/system preference
  const [theme, setThemeState] = useState(() => {
    // Safe check for SSR
    if (typeof window === "undefined") return "light";

    try {
      const savedTheme = localStorage.getItem("orbit-theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      // Check system preference
      if (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) {
        return "dark";
      }
    } catch {
      // localStorage might not be available
    }
    return "light";
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
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      localStorage.setItem("orbit-theme", theme);
    } catch {
      // localStorage might not be available
    }
  }, [theme]);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const isModalOpen = useMemo(
    () =>
      showProfileModal ||
      showCurrentUserModal ||
      selectedPost !== null ||
      isTheaterModeOpen,
    [showProfileModal, showCurrentUserModal, selectedPost, isTheaterModeOpen],
  );

  // Track if we're leaving the messages tab (used by MessagesTab to cleanup)
  const isLeavingMessagesTab = useMemo(
    () => previousTab === TABS.MESSAGES && activeTab !== TABS.MESSAGES,
    [previousTab, activeTab],
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
    [activeTab],
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
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  const isDarkMode = theme === "dark";

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
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
      // Setters
      setActiveTab,
      setShowFriends,
      setShowMobileNav,
      setShowMobileRightSidebar,
      setIsLoading,
      setShowCopyNotification,
      setShowCurrentUserModal,
      setShowProfileModal,
      setSelectedPost,
      setIsTheaterModeOpen,
      setTheme,
      // Actions
      closeMobileNav,
      closeAllModals,
      toggleTheme,
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
    ],
  );

  return (
    <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

export default UIContext;
