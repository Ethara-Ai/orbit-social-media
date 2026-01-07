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
  NOTIFICATION_POPUP_DURATION,
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
    []
  );

  // ==========================================================================
  // Notifications State
  // ==========================================================================
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationCount, setNotificationCount] = useState(() =>
    countUnread(mockNotifications)
  );
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Auto-generate notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification(
        friends,
        suggestedUsers,
        FRIEND_REQUEST_PROBABILITY
      );

      if (newNotification) {
        setNotifications((prev) => {
          const updated = addNotification(
            prev,
            newNotification,
            MAX_NOTIFICATIONS
          );
          setNotificationCount(countUnread(updated));
          return updated;
        });

        setLatestNotification(newNotification);
        setShowNotificationPopup(true);

        setTimeout(() => {
          setShowNotificationPopup(false);
        }, NOTIFICATION_POPUP_DURATION);
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

  const dismissNotificationPopup = useCallback(() => {
    setShowNotificationPopup(false);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      notifications,
      notificationCount,
      showNotificationPopup,
      latestNotification,
      // Setters
      setNotifications,
      setNotificationCount,
      setShowNotificationPopup,
      setLatestNotification,
      // Actions
      markNotificationsAsRead,
      dismissNotificationPopup,
    }),
    [
      notifications,
      notificationCount,
      showNotificationPopup,
      latestNotification,
      markNotificationsAsRead,
      dismissNotificationPopup,
    ]
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
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}

export default NotificationsContext;
