// Custom hooks barrel export
// Centralized exports for all hooks used across the application

// ============================================================================
// Context Hooks - Domain-specific state access
// Re-exported from AppContext for convenience
// ============================================================================

export {
  useUser,
  useFeed,
  useMessages,
  useNotifications,
  useExplore,
  useUI,
  useApp,
} from "../context/AppContext";

// ============================================================================
// Utility Hooks - Reusable logic hooks
// ============================================================================

export { default as useDebounce } from "./useDebounce";
export { default as useLocalStorage } from "./useLocalStorage";
export { default as useMediaQuery } from "./useMediaQuery";
export { default as useClickOutside } from "./useClickOutside";
export { default as useScrollToBottom } from "./useScrollToBottom";
export { default as useScrollPosition } from "./useScrollPosition";

// ============================================================================
// Action Hooks - Business logic handlers
// ============================================================================

export { default as useFeedActions } from "./useFeedActions";
export { default as useMessagesActions } from "./useMessagesActions";

// ============================================================================
// Facade Hooks - Simplified component interfaces
// ============================================================================

export { default as usePostCard } from "./usePostCard";
