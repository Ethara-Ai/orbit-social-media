/* eslint-disable react-refresh/only-export-components */
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
 * 1. UIProvider - Global UI state (loading, modals, tabs)
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
// Convenience hook to access all contexts at once
// Use sparingly - prefer specific hooks for better performance
// ============================================================================

/**
 * Hook to access all contexts at once.
 * Prefer using domain-specific hooks (useUser, useFeed, etc.) for better
 * performance as this hook will cause re-renders when ANY context changes.
 */
export function useApp() {
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
