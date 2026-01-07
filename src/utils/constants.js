/**
 * Application Constants
 * Centralized configuration and constant values
 */

/**
 * Global scrollbar styles to be injected into the document
 * These styles provide custom scrollbar appearance across the application
 */
export const GLOBAL_SCROLLBAR_STYLES = `
  * {
    box-sizing: border-box;
  }

  /* Light mode scrollbar */
  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  body::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #f97316, #ea580c);
    border-radius: 10px;
  }

  body::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, #ea580c, #c2410c);
  }

  body {
    scrollbar-width: thin;
    scrollbar-color: #f97316 #f1f5f9;
  }

  /* Dark mode scrollbar */
  .dark body::-webkit-scrollbar-track,
  html.dark body::-webkit-scrollbar-track {
    background: #1e293b;
  }

  .dark body,
  html.dark body {
    scrollbar-color: #f97316 #1e293b;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
  }

  /* Dark mode custom scrollbar */
  .dark .custom-scrollbar::-webkit-scrollbar-thumb,
  html.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
  }

  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover,
  html.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  .dark .custom-scrollbar,
  html.dark .custom-scrollbar {
    scrollbar-color: #475569 transparent;
  }
`;

/**
 * Navigation tab identifiers
 */
export const TABS = {
  FEED: "feed",
  EXPLORE: "explore",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
};

/**
 * Loading screen duration in milliseconds
 */
export const LOADING_DURATION = 3000;

/**
 * Notification popup duration in milliseconds
 */
export const NOTIFICATION_POPUP_DURATION = 4000;

/**
 * Copy notification duration in milliseconds
 */
export const COPY_NOTIFICATION_DURATION = 3000;

/**
 * Empty chat popup duration in milliseconds
 */
export const EMPTY_CHAT_POPUP_DURATION = 3000;

/**
 * Auto-notification interval in milliseconds (1 minute)
 */
export const NOTIFICATION_INTERVAL = 60000;

/**
 * Smart response delay in milliseconds
 */
export const SMART_RESPONSE_DELAY = 2000;

/**
 * Maximum number of notifications to keep
 */
export const MAX_NOTIFICATIONS = 20;

/**
 * Number of active online friends to display
 */
export const MAX_ACTIVE_FRIENDS = 5;

/**
 * Number of suggested users to display
 */
export const MAX_SUGGESTED_USERS = 3;

/**
 * Probability of friend request vs connection notification (0-1)
 */
export const FRIEND_REQUEST_PROBABILITY = 0.3;

/**
 * Default avatar fallback URL
 */
export const DEFAULT_AVATAR_URL =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";

/**
 * Animation variants for consistent animations
 */
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  slideInFromRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  mobileSlideIn: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
};

/**
 * Transition presets for animations
 */
export const TRANSITIONS = {
  default: { duration: 0.3 },
  fast: { duration: 0.2 },
  slow: { duration: 0.4 },
  spring: { type: "spring", damping: 25, stiffness: 200 },
  springBouncy: { type: "spring", damping: 20, stiffness: 300 },
  staggerChildren: (stagger = 0.05) => ({
    staggerChildren: stagger,
  }),
  delayedChild: (index, delay = 0.1) => ({
    delay: index * delay,
    duration: 0.4,
  }),
};

/**
 * Breakpoint values (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/**
 * Z-index layers for consistent stacking
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
};

/**
 * App metadata
 */
export const APP_CONFIG = {
  name: "Orbit",
  tagline: "Connect • Discover • Thrive",
  year: 2026,
};

export default {
  GLOBAL_SCROLLBAR_STYLES,
  TABS,
  LOADING_DURATION,
  NOTIFICATION_POPUP_DURATION,
  COPY_NOTIFICATION_DURATION,
  EMPTY_CHAT_POPUP_DURATION,
  NOTIFICATION_INTERVAL,
  SMART_RESPONSE_DELAY,
  MAX_NOTIFICATIONS,
  MAX_ACTIVE_FRIENDS,
  MAX_SUGGESTED_USERS,
  FRIEND_REQUEST_PROBABILITY,
  DEFAULT_AVATAR_URL,
  ANIMATION_VARIANTS,
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
  APP_CONFIG,
};
