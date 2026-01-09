/* eslint-disable react-refresh/only-export-components */
import { useMemo } from 'react';

// Import Data
import { trendingTopics } from '../../data/mockData';

// Import focused UI providers and hooks
import {
  TabProvider,
  useTab,
  ThemeProvider,
  useTheme,
  ModalProvider,
  useModal,
  MobileNavProvider,
  useMobileNav,
  LoadingProvider,
  useLoading,
  NotificationPopupProvider,
  useNotificationPopup,
} from './ui';

// Import Utils
import { TABS } from '../../utils/constants';

// ============================================================================
// UI Provider
// Composes all focused UI providers for cleaner app setup
//
// Architecture Note:
// The original monolithic UIContext has been split into focused providers
// for better performance. Each provider manages a specific concern:
// - TabProvider: Tab navigation state
// - ThemeProvider: Theme/dark mode state
// - ModalProvider: Modal/overlay state
// - MobileNavProvider: Mobile navigation state
// - LoadingProvider: App loading state
// - NotificationPopupProvider: Transient popup notifications
//
// Components should import specific hooks (useTab, useTheme, etc.) for
// better performance. The useUI hook is provided for backward compatibility
// but will cause more re-renders.
// ============================================================================

export function UIProvider({ children }) {
  return (
    <LoadingProvider>
      <ThemeProvider>
        <TabProvider>
          <MobileNavProvider>
            <ModalProvider>
              <NotificationPopupProvider>{children}</NotificationPopupProvider>
            </ModalProvider>
          </MobileNavProvider>
        </TabProvider>
      </ThemeProvider>
    </LoadingProvider>
  );
}

// ============================================================================
// Compatibility Hook
// Aggregates all focused hooks for backward compatibility
//
// ⚠️ PERFORMANCE WARNING:
// Using this hook will subscribe to ALL UI contexts at once.
// For better performance, use the specific hooks:
// - useTab() for tab navigation
// - useTheme() for theme/dark mode
// - useModal() for modals
// - useMobileNav() for mobile navigation
// - useLoading() for loading state
// - useNotificationPopup() for popup notifications
// ============================================================================

export function useUI() {
  const tab = useTab();
  const theme = useTheme();
  const modal = useModal();
  const mobileNav = useMobileNav();
  const loading = useLoading();
  const notificationPopup = useNotificationPopup();

  // Memoize the combined value to reduce object creation
  // Note: This still re-renders when ANY of the contexts change
  return useMemo(
    () => ({
      // Tab state and actions
      activeTab: tab.activeTab,
      previousTab: tab.previousTab,
      isLeavingMessagesTab: tab.isLeavingMessagesTab,
      setActiveTab: tab.setActiveTab,

      // Theme state and actions
      theme: theme.theme,
      isDarkMode: theme.isDarkMode,
      setTheme: theme.setTheme,
      toggleTheme: theme.toggleTheme,

      // Modal state and actions
      showCurrentUserModal: modal.showCurrentUserModal,
      showProfileModal: modal.showProfileModal,
      selectedPost: modal.selectedPost,
      isTheaterModeOpen: modal.isTheaterModeOpen,
      isModalOpen: modal.isModalOpen,
      setShowCurrentUserModal: modal.setShowCurrentUserModal,
      setShowProfileModal: modal.setShowProfileModal,
      setSelectedPost: modal.setSelectedPost,
      setIsTheaterModeOpen: modal.setIsTheaterModeOpen,
      closeAllModals: modal.closeAllModals,

      // Mobile navigation state and actions
      showMobileNav: mobileNav.showMobileNav,
      showMobileRightSidebar: mobileNav.showMobileRightSidebar,
      setShowMobileNav: mobileNav.setShowMobileNav,
      setShowMobileRightSidebar: mobileNav.setShowMobileRightSidebar,
      closeMobileNav: mobileNav.closeMobileNav,

      // Loading state
      isLoading: loading.isLoading,
      setIsLoading: loading.setIsLoading,

      // Notification popup state and actions
      showCopyNotification: notificationPopup.showCopyNotification,
      setShowCopyNotification: notificationPopup.setShowCopyNotification,
      showCopyNotificationWithTimeout: notificationPopup.showCopyNotificationWithTimeout,

      // Friends sidebar state (kept here for compatibility)
      showFriends: false,
      setShowFriends: () => {},

      // Static data
      trendingTopics,

      // Constants for convenience
      TABS,
    }),
    [tab, theme, modal, mobileNav, loading, notificationPopup]
  );
}

// ============================================================================
// Re-export focused hooks for direct usage (recommended)
// ============================================================================

export { useTab, useTheme, useModal, useMobileNav, useLoading, useNotificationPopup };

export default UIProvider;
