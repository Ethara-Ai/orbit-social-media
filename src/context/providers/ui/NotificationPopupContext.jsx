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
import { COPY_NOTIFICATION_DURATION } from '../../../utils/constants';

// ============================================================================
// Context Definition
// ============================================================================

const NotificationPopupContext = createContext(null);
NotificationPopupContext.displayName = 'NotificationPopupContext';

// ============================================================================
// Notification Popup Provider
// Focused provider for transient notification popups (copy confirmation, etc.)
//
// This is separated from the main NotificationsContext which handles
// the notifications list/feed. This context handles temporary UI feedback.
// ============================================================================

export function NotificationPopupProvider({ children }) {
  // ==========================================================================
  // State
  // ==========================================================================
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copyNotificationMessage, setCopyNotificationMessage] = useState(
    'Link copied to clipboard'
  );

  // Ref for copy notification timeout to prevent memory leaks
  const copyNotificationTimeoutRef = useRef(null);

  // ==========================================================================
  // Cleanup on unmount
  // ==========================================================================
  useEffect(() => {
    return () => {
      if (copyNotificationTimeoutRef.current) {
        clearTimeout(copyNotificationTimeoutRef.current);
      }
    };
  }, []);

  // ==========================================================================
  // Actions
  // ==========================================================================

  /**
   * Show copy notification with automatic timeout cleanup
   * Prevents memory leaks by clearing previous timeouts
   * @param {string} message - Optional custom message to display
   */
  const showCopyNotificationWithTimeout = useCallback((message = 'Link copied to clipboard') => {
    // Clear any existing timeout to prevent overlap
    if (copyNotificationTimeoutRef.current) {
      clearTimeout(copyNotificationTimeoutRef.current);
    }

    setCopyNotificationMessage(message);
    setShowCopyNotification(true);

    copyNotificationTimeoutRef.current = setTimeout(() => {
      setShowCopyNotification(false);
      copyNotificationTimeoutRef.current = null;
    }, COPY_NOTIFICATION_DURATION);
  }, []);

  /**
   * Immediately hide the copy notification
   */
  const hideCopyNotification = useCallback(() => {
    if (copyNotificationTimeoutRef.current) {
      clearTimeout(copyNotificationTimeoutRef.current);
      copyNotificationTimeoutRef.current = null;
    }
    setShowCopyNotification(false);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // State
      showCopyNotification,
      copyNotificationMessage,
      // Setters (for edge cases)
      setShowCopyNotification,
      // Actions (preferred API)
      showCopyNotificationWithTimeout,
      hideCopyNotification,
    }),
    [
      showCopyNotification,
      copyNotificationMessage,
      showCopyNotificationWithTimeout,
      hideCopyNotification,
    ]
  );

  return (
    <NotificationPopupContext.Provider value={contextValue}>
      {children}
    </NotificationPopupContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useNotificationPopup() {
  const context = useContext(NotificationPopupContext);
  if (!context) {
    throw new Error('useNotificationPopup must be used within a NotificationPopupProvider');
  }
  return context;
}

export default NotificationPopupContext;
