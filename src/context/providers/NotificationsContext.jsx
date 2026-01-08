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
} from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const NotificationsContext = createContext(null);

// ============================================================================
// Notifications Provider
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

  // Auto-generate notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification(
        friends,
        suggestedUsers,
        FRIEND_REQUEST_PROBABILITY,
      );

      if (newNotification) {
        setNotifications((prev) => {
          const updated = addNotification(
            prev,
            newNotification,
            MAX_NOTIFICATIONS,
          );
          setNotificationCount(countUnread(updated));
          return updated;
        });
      }
    }, NOTIFICATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

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
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      notifications,
      notificationCount,
      // Setters
      setNotifications,
      setNotificationCount,
      // Actions
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
