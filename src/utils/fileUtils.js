/**
 * File Utilities
 * File processing and validation functions
 */

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
 * Default fallback avatar URL
 */
export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";

/**
 * Create a fallback image handler for img onError
 * @param {string} fallbackSrc - Fallback image source
 * @returns {Function} Error handler function
 */
export const createImageErrorHandler = (
  fallbackSrc = DEFAULT_AVATAR,
) => {
  return (e) => {
    e.target.src = fallbackSrc;
  };
};

export default {
  readFileAsDataUrl,
  isValidImage,
  processImageFile,
  DEFAULT_AVATAR,
  createImageErrorHandler,
};
