// Context Providers - Barrel Export
// Centralized exports for all domain-specific context providers and hooks

// ============================================================================
// User Context
// ============================================================================
export { UserProvider, useUser } from "./UserContext";

// ============================================================================
// Feed Context
// ============================================================================
export { FeedProvider, useFeed } from "./FeedContext";

// ============================================================================
// Messages Context
// ============================================================================
export { MessagesProvider, useMessages } from "./MessagesContext";

// ============================================================================
// Notifications Context
// ============================================================================
export {
  NotificationsProvider,
  useNotifications,
} from "./NotificationsContext";

// ============================================================================
// Explore Context
// ============================================================================
export { ExploreProvider, useExplore } from "./ExploreContext";

// ============================================================================
// UI Context
// ============================================================================
export { UIProvider, useUI } from "./UIContext";
