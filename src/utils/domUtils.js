/**
 * DOM Utilities
 * DOM manipulation and browser interaction functions
 */

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
  copyToClipboard,
  scrollToTop,
  scrollIntoView,
  cn,
};
