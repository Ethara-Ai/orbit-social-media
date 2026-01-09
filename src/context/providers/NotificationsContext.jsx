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
import {
  friends,
  suggestedUsers,
  createMockNotifications,
} from "../../data/mockData";

// Import Services
import {
  generateRandomNotification,
  markAllAsRead,
  countUnread,
  addNotification,
} from "../../services/notificationService";

// Import Utils
import {
  NOTIFICATION_INTERVAL,
  MAX_NOTIFICATIONS,
  FRIEND_REQUEST_PROBABILITY,
  TABS,
} from "../../utils/constants";

// Import UI Context to check active tab
import { useUI } from "./UIContext";

// ============================================================================
// Context Definition
// ============================================================================

const NotificationsContext = createContext(null);

// ============================================================================
// Notifications Provider
// Self-contained provider managing notification-related state and actions
//
// Encapsulation Strategy:
// - All state setters (setNotifications, setNotificationCount) are kept
//   internal and only accessible through actions for better encapsulation
// - Auto-generation of notifications is handled internally
// - Components only interact through actions (markNotificationsAsRead, etc.)
// ============================================================================

export function NotificationsProvider({ children }) {
  // ==========================================================================
  // Initialize Mock Data
  // ==========================================================================
  const mockNotifications = useMemo(
    () => createMockNotifications(friends, suggestedUsers),
    [],
  );

  // ==========================================================================
  // Notifications State
  // ==========================================================================
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationCount, setNotificationCount] = useState(() =>
    countUnread(mockNotifications),
  );

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Get active tab from UI context to check if user is on notifications tab
  const { activeTab } = useUI();

  // Auto-generate notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification(
        friends,
        suggestedUsers,
        FRIEND_REQUEST_PROBABILITY,
      );

      if (newNotification) {
        // If user is on notifications tab, mark new notification as read immediately
        const isOnNotificationsTab = activeTab === TABS.NOTIFICATIONS;
        const notificationToAdd = isOnNotificationsTab
          ? { ...newNotification, isRead: true }
          : newNotification;

        setNotifications((prev) => {
          const updated = addNotification(
            prev,
            notificationToAdd,
            MAX_NOTIFICATIONS,
          );
          // Only update count if user is NOT on notifications tab
          if (!isOnNotificationsTab) {
            setNotificationCount(countUnread(updated));
          }
          return updated;
        });
      }
    }, NOTIFICATION_INTERVAL);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Update notification count when notifications change
  useEffect(() => {
    setNotificationCount(countUnread(notifications));
  }, [notifications]);

  // ==========================================================================
  // Notifications Handlers
  // ==========================================================================

  const markNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => markAllAsRead(prev));
    setNotificationCount(0);
  }, []);

  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
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
    }),
    [
      notifications,
      notificationCount,
      markNotificationsAsRead,
      markNotificationAsRead,
    ],
  );

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    );
  }
  return context;
}

export default NotificationsContext;
