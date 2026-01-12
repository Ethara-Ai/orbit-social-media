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

// Profile post IDs that notifications can reference (user's own posts)
const PROFILE_POST_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

// Posts that have actual mention comments (with @jordanm)
const POSTS_WITH_MENTIONS = ['p3', 'p5'];

// Messages matching profile post captions
const POST_CAPTIONS = {
  p1: 'Mountain vibes post ⛰️',
  p2: 'Golden hour magic post ✨',
  p3: 'Exploring new horizons post 🌅',
  p4: "Nature's beauty post 🌲",
  p5: 'Waterfall adventures post 💧',
  p6: 'Misty mornings post 🌫️',
};

/**
 * Generate a random notification from a friend (connection)
 * Only generates post-related notifications (like, comment, mention)
 * Mention notifications only reference posts that have actual @mentions
 * @param {Object} user - The user who triggered the notification
 * @returns {Object} Notification object
 */
export const generateConnectionNotification = (user) => {
  // Only post-related notification types
  const types = [NOTIFICATION_TYPES.LIKE, NOTIFICATION_TYPES.COMMENT, NOTIFICATION_TYPES.MENTION];

  let type = types[Math.floor(Math.random() * types.length)];
  let postId;

  // For mention notifications, only use posts that have actual mentions
  if (type === NOTIFICATION_TYPES.MENTION) {
    postId = POSTS_WITH_MENTIONS[Math.floor(Math.random() * POSTS_WITH_MENTIONS.length)];
  } else {
    postId = PROFILE_POST_IDS[Math.floor(Math.random() * PROFILE_POST_IDS.length)];
  }

  // Generate message based on notification type and post
  let message;
  if (type === NOTIFICATION_TYPES.LIKE) {
    message = `liked your ${POST_CAPTIONS[postId]}`;
  } else if (type === NOTIFICATION_TYPES.COMMENT) {
    message = `commented on your ${POST_CAPTIONS[postId]}`;
  } else {
    message = `mentioned you in your ${POST_CAPTIONS[postId]}`;
  }

  return {
    id: Date.now().toString(),
    type,
    user,
    message,
    timestamp: 'Just now',
    createdAt: Date.now(),
    isRead: false,
    isConnection: true,
    postId,
  };
};

/**
 * Generate a random notification (only post-related notifications)
 * @param {Array} friends - List of user's friends/connections
 * @returns {Object} Notification object
 */
export const generateRandomNotification = (friends) => {
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
 * Mark a single notification as read by ID
 * @param {Array} notifications - Current notifications array
 * @param {string} notificationId - ID of the notification to mark as read
 * @returns {Array} Updated notifications array with the specified notification marked as read
 */
export const markAsRead = (notifications, notificationId) => {
  return notifications.map((notification) =>
    notification.id === notificationId ? { ...notification, isRead: true } : notification
  );
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

  return (
    configs[type] || {
      iconName: 'Bell',
      iconColor: 'text-slate-400',
      bgClass: 'bg-slate-50',
    }
  );
};

export default {
  NOTIFICATION_TYPES,
  generateConnectionNotification,
  generateRandomNotification,
  markAllAsRead,
  markAsRead,
  countUnread,
  addNotification,
  getNotificationIconConfig,
};
