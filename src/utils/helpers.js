/**
 * Utility Helpers - Backward Compatibility Layer
 *
 * This file re-exports utilities from domain-specific modules for backward compatibility.
 * New code should import directly from the specific utility modules:
 *
 * - timeUtils.js - Time and date formatting
 * - arrayUtils.js - Array manipulation
 * - fileUtils.js - File processing and validation
 * - stringUtils.js - String manipulation
 * - domUtils.js - DOM manipulation and browser interactions
 * - numberUtils.js - Number formatting and generation
 * - objectUtils.js - Object manipulation and function utilities
 */

// Time Utilities
import * as timeUtilsImport from './timeUtils';
export { formatRelativeTime, formatTime } from './timeUtils';

// Array Utilities
import * as arrayUtilsImport from './arrayUtils';
export { pickRandom, shuffleArray, getRandomItems, groupBy } from './arrayUtils';

// File Utilities
import * as fileUtilsImport from './fileUtils';
export {
  readFileAsDataUrl,
  isValidImage,
  processImageFile,
  DEFAULT_AVATAR,
  createImageErrorHandler,
} from './fileUtils';

// String Utilities
import * as stringUtilsImport from './stringUtils';
export { truncateText, capitalizeFirst, isEmpty } from './stringUtils';

// DOM Utilities
import * as domUtilsImport from './domUtils';
export { copyToClipboard, scrollToTop, scrollIntoView, cn } from './domUtils';

// Number Utilities
import * as numberUtilsImport from './numberUtils';
export { formatNumber, generateId } from './numberUtils';

// Object Utilities
import * as objectUtilsImport from './objectUtils';
export { deepClone, debounce, throttle } from './objectUtils';

// Default export with all utilities
export default {
  // Time
  ...timeUtilsImport,
  // Array
  ...arrayUtilsImport,
  // File
  ...fileUtilsImport,
  // String
  ...stringUtilsImport,
  // DOM
  ...domUtilsImport,
  // Number
  ...numberUtilsImport,
  // Object
  ...objectUtilsImport,
};
