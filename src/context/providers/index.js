// Context Providers - Barrel Export
// Centralized exports for all domain-specific context providers and hooks

// ============================================================================
// User Context
// ============================================================================
export { UserProvider, useUser } from './UserContext';

// ============================================================================
// Feed Context
// ============================================================================
export { FeedProvider, useFeed } from './FeedContext';

// ============================================================================
// Messages Context
// ============================================================================
export { MessagesProvider, useMessages } from './MessagesContext';

// ============================================================================
// Notifications Context
// ============================================================================
export { NotificationsProvider, useNotifications } from './NotificationsContext';

// ============================================================================
// Explore Context
// ============================================================================
export { ExploreProvider, useExplore } from './ExploreContext';

// ============================================================================
// UI Context (Composed Provider + Compatibility Hook)
// ============================================================================
export { UIProvider, useUI } from './UIContext';

// ============================================================================
// Focused UI Contexts (Recommended for better performance)
// These are split from the monolithic UIContext to reduce re-renders
// ============================================================================
export {
  // Tab Navigation
  TabProvider,
  useTab,
  // Theme Management
  ThemeProvider,
  useTheme,
  // Modal Management
  ModalProvider,
  useModal,
  // Mobile Navigation
  MobileNavProvider,
  useMobileNav,
  // Loading State
  LoadingProvider,
  useLoading,
  // Notification Popups
  NotificationPopupProvider,
  useNotificationPopup,
} from './ui';
