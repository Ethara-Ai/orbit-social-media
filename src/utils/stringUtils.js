/**
 * String Utilities
 * String manipulation and formatting functions
 */

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} Whether value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Convert URLs in text to clickable links
 * @param {string} text - Text that may contain URLs
 * @returns {Array} Array of text and link elements
 */
export const linkifyText = (text) => {
  if (!text) return [];

  // Regular expression to match URLs
  const urlRegex =
    /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}[^\s]*)/gi;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  // Create a new regex instance for iteration
  const regex = new RegExp(urlRegex);

  while ((match = regex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex, match.index),
        key: key++,
      });
    }

    // Add the URL as a link
    let url = match[0];
    let href = url;

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      href = 'https://' + url;
    }

    parts.push({
      type: 'link',
      content: url,
      href: href,
      key: key++,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after the last URL
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
      key: key++,
    });
  }

  // If no URLs were found, return the original text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: text,
      key: 0,
    });
  }

  return parts;
};

export default {
  truncateText,
  capitalizeFirst,
  isEmpty,
  linkifyText,
};
