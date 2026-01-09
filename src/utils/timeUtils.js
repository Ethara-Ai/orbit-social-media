/**
 * Time Utilities
 * Time and date formatting functions
 */

/**
 * Format timestamp to relative time string
 * @param {Date|string|number} timestamp - Timestamp to format
 * @returns {string} Relative time string (e.g., "2 hours ago", "Just now")
 */
export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return time.toLocaleDateString();
};

/**
 * Format time to HH:MM format
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default {
  formatRelativeTime,
  formatTime,
};
