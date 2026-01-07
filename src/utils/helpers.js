/**
 * Utility Helpers
 * Common utility functions used across the application
 */

/**
 * Pick a random item from an array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random item from array
 */
export const pickRandom = (arr) => {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random items from an array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to get
 * @returns {Array} Random subset of items
 */
export const getRandomItems = (array, count) => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

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

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Whether copy was successful
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
};

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string|null>} Data URL or null if failed
 */
export const readFileAsDataUrl = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

/**
 * Validate if file is an image
 * @param {File} file - File to validate
 * @returns {boolean} Whether file is a valid image
 */
export const isValidImage = (file) => {
  return file && file.type.startsWith("image/");
};

/**
 * Process image file upload
 * @param {File} file - Image file
 * @returns {Promise<string|null>} Data URL or null if invalid
 */
export const processImageFile = async (file) => {
  if (!isValidImage(file)) return null;
  return readFileAsDataUrl(file);
};

/**
 * Scroll to top of page
 * @param {string} behavior - Scroll behavior ('smooth', 'instant', 'auto')
 */
export const scrollToTop = (behavior = "instant") => {
  window.scrollTo({ top: 0, behavior });
};

/**
 * Scroll element into view
 * @param {HTMLElement|null} element - Element to scroll to
 * @param {string} behavior - Scroll behavior
 */
export const scrollIntoView = (element, behavior = "smooth") => {
  element?.scrollIntoView({ behavior });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = "") => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return prefix
    ? `${prefix}-${timestamp}-${randomPart}`
    : `${timestamp}-${randomPart}`;
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {string|Function} key - Key to group by or function to get key
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === "function" ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Format number with K/M suffix for large numbers
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

/**
 * Create a fallback image handler for img onError
 * @param {string} fallbackSrc - Fallback image source
 * @returns {Function} Error handler function
 */
export const createImageErrorHandler = (
  fallbackSrc = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
) => {
  return (e) => {
    e.target.src = fallbackSrc;
  };
};

/**
 * Default fallback avatar URL
 */
export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";

/**
 * Class name utility - combines class names conditionally
 * @param  {...any} classes - Class names or conditional objects
 * @returns {string} Combined class string
 */
export const cn = (...classes) => {
  return classes
    .filter(Boolean)
    .map((c) => {
      if (typeof c === "string") return c;
      if (typeof c === "object") {
        return Object.entries(c)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();
};

export default {
  pickRandom,
  shuffleArray,
  getRandomItems,
  formatRelativeTime,
  formatTime,
  copyToClipboard,
  readFileAsDataUrl,
  isValidImage,
  processImageFile,
  scrollToTop,
  scrollIntoView,
  truncateText,
  capitalizeFirst,
  generateId,
  debounce,
  throttle,
  isEmpty,
  deepClone,
  groupBy,
  formatNumber,
  createImageErrorHandler,
  DEFAULT_AVATAR,
  cn,
};
