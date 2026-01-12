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
import { friends, createMockNotifications } from '../../data/mockData';

// Import Services
import {
  generateRandomNotification,
  markAllAsRead,
  countUnread,
  addNotification,
} from '../../services/notificationService';

// Import Utils
import { NOTIFICATION_INTERVAL, MAX_NOTIFICATIONS, TABS } from '../../utils/constants';

// Import focused UI hook for tab state
import { useTab } from './ui';

// ============================================================================
// Context Definition
// ============================================================================

const NotificationsContext = createContext(null);
NotificationsContext.displayName = 'NotificationsContext';

// ============================================================================
// Notifications Provider
// Self-contained provider managing notification-related state and actions
//
// Encapsulation Strategy:
// - All state setters (setNotifications, setNotificationCount) are kept
//   internal and only accessible through actions for better encapsulation
// - Auto-generation of notifications is handled internally
// - Components only interact through actions (markNotificationsAsRead, etc.)
//
// Memory Leak Fix:
// - Uses ref to track activeTab to prevent interval recreation on tab changes
// - Interval is only created once and reads current tab from ref
// ============================================================================

export function NotificationsProvider({ children }) {
  // ==========================================================================
  // Initialize Mock Data
  // ==========================================================================
  const mockNotifications = useMemo(() => createMockNotifications(friends), []);

  // ==========================================================================
  // Notifications State
  // ==========================================================================
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationCount, setNotificationCount] = useState(() => countUnread(mockNotifications));

  // ==========================================================================
  // Refs for stable interval closure
  // ==========================================================================

  // Get active tab from focused Tab context
  const { activeTab } = useTab();

  // Use ref to track activeTab - this prevents interval recreation on tab changes
  // and ensures the interval always reads the current value
  const activeTabRef = useRef(activeTab);

  // Keep ref in sync with state
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // ==========================================================================
  // Auto-generate notifications (with memory leak fix)
  // ==========================================================================
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification(friends);

      if (newNotification) {
        // Read current tab from ref to get latest value
        const isOnNotificationsTab = activeTabRef.current === TABS.NOTIFICATIONS;
        const notificationToAdd = isOnNotificationsTab
          ? { ...newNotification, isRead: true }
          : newNotification;

        setNotifications((prev) => {
          // Check for duplicates - prevent same user + same type + same message
          const isDuplicate = prev.some(
            (n) =>
              n.user.id === notificationToAdd.user.id &&
              n.type === notificationToAdd.type &&
              n.message === notificationToAdd.message
          );

          // Skip adding if it's a duplicate
          if (isDuplicate) {
            return prev;
          }

          const updated = addNotification(prev, notificationToAdd, MAX_NOTIFICATIONS);
          // Only update count if user is NOT on notifications tab
          if (!isOnNotificationsTab) {
            setNotificationCount(countUnread(updated));
          }
          return updated;
        });
      }
    }, NOTIFICATION_INTERVAL);

    // Cleanup interval on unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Empty dependency array - interval created only once

  // ==========================================================================
  // Notifications Handlers
  // ==========================================================================

  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => markAllAsRead(prev));
    setNotificationCount(0);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      );
      setNotificationCount(countUnread(updated));
      return updated;
    });
  }, []);

  /**
   * Add a new notification manually
   * @param {Object} notification - The notification to add
   */
  const addNewNotification = useCallback((notification) => {
    const isOnNotificationsTab = activeTabRef.current === TABS.NOTIFICATIONS;
    const notificationToAdd = isOnNotificationsTab
      ? { ...notification, isRead: true }
      : notification;

    setNotifications((prev) => {
      const updated = addNotification(prev, notificationToAdd, MAX_NOTIFICATIONS);
      if (!isOnNotificationsTab) {
        setNotificationCount(countUnread(updated));
      }
      return updated;
    });
  }, []);

  // ==========================================================================
  // Context Value
  //
  // Exposed to consumers:
  // - Read-only data (notifications, notificationCount)
  // - Actions (mark notifications as read)
  //
  // Kept internal (not exposed):
  // - setNotifications (managed by auto-generation and actions)
  // - setNotificationCount (computed from notifications state)
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      notifications,
      notificationCount,
      // Actions (encapsulate state changes)
      markNotificationsAsRead,
      markNotificationAsRead,
      addNewNotification,
    }),
    [
      notifications,
      notificationCount,
      markNotificationsAsRead,
      markNotificationAsRead,
      addNewNotification,
    ]
  );

  return (
    <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}

export default NotificationsContext;
