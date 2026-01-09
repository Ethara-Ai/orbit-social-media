/* eslint-disable react-refresh/only-export-components */
import { useRef, useEffect } from 'react';
import {
  UserProvider,
  useUser,
  FeedProvider,
  useFeed,
  MessagesProvider,
  useMessages,
  NotificationsProvider,
  useNotifications,
  ExploreProvider,
  useExplore,
  UIProvider,
  useUI,
  // Focused UI hooks (recommended for better performance)
  useTab,
  useTheme,
  useModal,
  useMobileNav,
  useLoading,
  useNotificationPopup,
} from './providers';

// ============================================================================
// App Provider - Clean Composition of Domain-Specific Contexts
// ============================================================================

/**
 * AppProvider composes all domain-specific context providers.
 * Each provider is self-contained and manages its own state.
 * Components access context via domain-specific hooks (useUser, useFeed, etc.)
 *
 * Provider Order (outer to inner):
 * 1. UIProvider - Global UI state (composed of focused providers internally)
 *    - LoadingProvider - App loading state
 *    - ThemeProvider - Theme/dark mode
 *    - TabProvider - Tab navigation
 *    - MobileNavProvider - Mobile navigation overlays
 *    - ModalProvider - Modal/overlay state
 *    - NotificationPopupProvider - Transient popup notifications
 * 2. NotificationsProvider - Notification state and auto-generation
 * 3. MessagesProvider - Conversations and messaging
 * 4. UserProvider - Current user and friends data
 * 5. FeedProvider - Posts and comments for the feed
 * 6. ExploreProvider - Explore section posts and categories
 */
export function AppProvider({ children }) {
  return (
    <UIProvider>
      <NotificationsProvider>
        <MessagesProvider>
          <UserProvider>
            <FeedProvider>
              <ExploreProvider>{children}</ExploreProvider>
            </FeedProvider>
          </UserProvider>
        </MessagesProvider>
      </NotificationsProvider>
    </UIProvider>
  );
}

// ============================================================================
// Re-export all domain-specific hooks for backward compatibility
// ============================================================================

export { useUser, useFeed, useMessages, useNotifications, useExplore, useUI };

// ============================================================================
// Re-export focused UI hooks (recommended for better performance)
// ============================================================================

export { useTab, useTheme, useModal, useMobileNav, useLoading, useNotificationPopup };

// ============================================================================
// DEPRECATED: Convenience hook to access all contexts at once
// ============================================================================

/**
 * @deprecated This hook is deprecated and will be removed in a future version.
 *
 * PERFORMANCE WARNING:
 * Using this hook will subscribe to ALL contexts at once, causing re-renders
 * when ANY context changes. This is almost never what you want.
 *
 * Instead, use the specific hooks for better performance:
 * - useUser() - Current user and friends data
 * - useFeed() - Posts and comments for the feed
 * - useMessages() - Conversations and messaging
 * - useNotifications() - Notification state
 * - useExplore() - Explore section state
 *
 * For UI state, prefer the focused hooks:
 * - useTab() - Tab navigation state
 * - useTheme() - Theme/dark mode state
 * - useModal() - Modal/overlay state
 * - useMobileNav() - Mobile navigation state
 * - useLoading() - App loading state
 * - useNotificationPopup() - Popup notification state
 *
 * Only use useUI() if you truly need multiple UI states at once.
 *
 * @returns {Object} Object containing all context values (causes excessive re-renders)
 */
export function useApp() {
  // Track if we've shown the deprecation warning using a ref
  const hasWarned = useRef(false);

  // Show deprecation warning once in development using useEffect
  useEffect(() => {
    if (import.meta.env.DEV && !hasWarned.current) {
      hasWarned.current = true;
      console.warn(
        '[Orbit] useApp() is deprecated and will be removed in a future version.\n\n' +
          'This hook causes performance issues because it subscribes to ALL contexts.\n\n' +
          'Please migrate to specific hooks:\n' +
          '  - useUser() for user data\n' +
          '  - useFeed() for feed/posts\n' +
          '  - useMessages() for messaging\n' +
          '  - useNotifications() for notifications\n' +
          '  - useExplore() for explore content\n' +
          '  - useTab() for tab navigation\n' +
          '  - useTheme() for theme/dark mode\n' +
          '  - useModal() for modals\n' +
          '  - useMobileNav() for mobile nav\n' +
          '  - useLoading() for loading state\n' +
          '  - useNotificationPopup() for popup notifications\n\n' +
          'See documentation for migration guide.'
      );
    }
  }, []);

  return {
    user: useUser(),
    feed: useFeed(),
    messages: useMessages(),
    notifications: useNotifications(),
    explore: useExplore(),
    ui: useUI(),
  };
}

export default AppProvider;
