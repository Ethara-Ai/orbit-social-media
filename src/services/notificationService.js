/**
 * Notification Service
 * Handles notification generation and management logic
 */

// Notification types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  FRIEND_REQUEST: 'friend_request',
};

// Action messages for different notification types
const ACTION_MESSAGES = [
  'liked your post',
  'commented on your photo',
  'shared your content',
  'mentioned you',
  'reacted to your story',
];

/**
 * Generate a random notification from a friend (connection)
 * @param {Object} user - The user who triggered the notification
 * @returns {Object} Notification object
 */
export const generateConnectionNotification = (user) => {
  const types = [
    NOTIFICATION_TYPES.LIKE,
    NOTIFICATION_TYPES.COMMENT,
    NOTIFICATION_TYPES.FOLLOW,
    NOTIFICATION_TYPES.MENTION,
  ];

  return {
    id: Date.now().toString(),
    type: types[Math.floor(Math.random() * types.length)],
    user,
    message: ACTION_MESSAGES[Math.floor(Math.random() * ACTION_MESSAGES.length)],
    timestamp: 'now',
    isRead: false,
    isConnection: true,
  };
};

/**
 * Generate a friend request notification from a suggested user
 * @param {Object} user - The suggested user sending the request
 * @returns {Object} Notification object
 */
export const generateFriendRequestNotification = (user) => {
  return {
    id: Date.now().toString(),
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    user,
    message: 'sent you a connection request',
    timestamp: 'now',
    isRead: false,
    isConnection: false,
  };
};

/**
 * Generate a random notification (either friend request or connection activity)
 * @param {Array} friends - List of user's friends/connections
 * @param {Array} suggestedUsers - List of suggested users
 * @param {number} friendRequestChance - Probability of friend request (0-1), default 0.3
 * @returns {Object} Notification object
 */
export const generateRandomNotification = (
  friends,
  suggestedUsers,
  friendRequestChance = 0.3
) => {
  const isFriendRequest = Math.random() < friendRequestChance;

  if (isFriendRequest && suggestedUsers.length > 0) {
    const randomUser = suggestedUsers[Math.floor(Math.random() * suggestedUsers.length)];
    return generateFriendRequestNotification(randomUser);
  }

  if (friends.length > 0) {
    const randomUser = friends[Math.floor(Math.random() * friends.length)];
    return generateConnectionNotification(randomUser);
  }

  return null;
};

/**
 * Mark all notifications as read
 * @param {Array} notifications - Current notifications array
 * @returns {Array} Updated notifications array with all marked as read
 */
export const markAllAsRead = (notifications) => {
  return notifications.map((notification) => ({
    ...notification,
    isRead: true,
  }));
};

/**
 * Count unread notifications
 * @param {Array} notifications - Current notifications array
 * @returns {number} Count of unread notifications
 */
export const countUnread = (notifications) => {
  return notifications.filter((notification) => !notification.isRead).length;
};

/**
 * Add a new notification to the list (maintains max limit)
 * @param {Array} notifications - Current notifications array
 * @param {Object} newNotification - New notification to add
 * @param {number} maxNotifications - Maximum notifications to keep, default 20
 * @returns {Array} Updated notifications array
 */
export const addNotification = (notifications, newNotification, maxNotifications = 20) => {
  return [newNotification, ...notifications.slice(0, maxNotifications - 1)];
};

/**
 * Get notification icon configuration based on type
 * @param {string} type - Notification type
 * @returns {Object} Icon configuration with icon name and background class
 */
export const getNotificationIconConfig = (type) => {
  const configs = {
    [NOTIFICATION_TYPES.LIKE]: {
      iconName: 'Heart',
      iconColor: 'text-rose-500',
      bgClass: 'bg-rose-50',
    },
    [NOTIFICATION_TYPES.COMMENT]: {
      iconName: 'MessageCircle',
      iconColor: 'text-blue-500',
      bgClass: 'bg-blue-50',
    },
    [NOTIFICATION_TYPES.FOLLOW]: {
      iconName: 'UserPlus',
      iconColor: 'text-emerald-500',
      bgClass: 'bg-emerald-50',
    },
    [NOTIFICATION_TYPES.MENTION]: {
      iconName: 'User',
      iconColor: 'text-orange-500',
      bgClass: 'bg-orange-50',
    },
    [NOTIFICATION_TYPES.FRIEND_REQUEST]: {
      iconName: 'Users',
      iconColor: 'text-purple-500',
      bgClass: 'bg-purple-50',
    },
  };

  return configs[type] || {
    iconName: 'Bell',
    iconColor: 'text-slate-400',
    bgClass: 'bg-slate-50',
  };
};

export default {
  NOTIFICATION_TYPES,
  generateConnectionNotification,
  generateFriendRequestNotification,
  generateRandomNotification,
  markAllAsRead,
  countUnread,
  addNotification,
  getNotificationIconConfig,
};
