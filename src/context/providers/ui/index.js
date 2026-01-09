/**
 * UI Context Providers
 *
 * Split from the monolithic UIContext for better performance.
 * Each provider manages a specific concern, reducing unnecessary re-renders.
 *
 * Provider Order (outer to inner):
 * 1. LoadingProvider - App loading state
 * 2. ThemeProvider - Theme/dark mode
 * 3. TabProvider - Tab navigation
 * 4. MobileNavProvider - Mobile navigation overlays
 * 5. ModalProvider - Modal/overlay state
 * 6. NotificationPopupProvider - Transient popup notifications
 */

// Tab Navigation
export { TabProvider, useTab } from './TabContext';

// Theme Management
export { ThemeProvider, useTheme } from './ThemeContext';

// Modal Management
export { ModalProvider, useModal } from './ModalContext';

// Mobile Navigation
export { MobileNavProvider, useMobileNav } from './MobileNavContext';

// Loading State
export { LoadingProvider, useLoading } from './LoadingContext';

// Notification Popups (copy confirmation, etc.)
export { NotificationPopupProvider, useNotificationPopup } from './NotificationPopupContext';
