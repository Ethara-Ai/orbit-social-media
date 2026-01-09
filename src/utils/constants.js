/**
 * Application Constants
 * Centralized configuration and constant values
 */

/**
 * Navigation tab identifiers
 */
export const TABS = {
  FEED: 'feed',
  EXPLORE: 'explore',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  CONNECTIONS: 'connections',
  PROFILE: 'profile',
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
export const MAX_ACTIVE_FRIENDS = 6;

/**
 * Number of suggested users to display
 */
export const MAX_SUGGESTED_USERS = 3;

/**
 * Probability of friend request vs connection notification (0-1)
 */
export const FRIEND_REQUEST_PROBABILITY = 0.3;

/**
 * Textarea dimensions for CreatePost component
 */
export const TEXTAREA_MIN_HEIGHT = 40;
export const TEXTAREA_MAX_HEIGHT = 150;

/**
 * Default avatar fallback URL
 */
export const DEFAULT_AVATAR_URL =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face';

/**
 * Static profile data
 */
export const PROFILE_DATA = {
  name: 'Jordan Mitchell',
  username: '@jordanm',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop',
  profession: 'Creative Director',
  location: 'Austin, TX',
  bio: "Creative Director passionate about design, technology, and creating meaningful experiences. Let's connect and build something amazing together! 🚀",
  followers: 16,
  following: 16,
};

/**
 * Mock profile posts data
 */
export const INITIAL_PROFILE_POSTS = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
    likes: 234,
    comments: 18,
    caption: 'Mountain vibes ⛰️',
    isLiked: false,
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=600&fit=crop',
    likes: 456,
    comments: 32,
    caption: 'Golden hour magic ✨',
    isLiked: false,
  },
  {
    id: 'p3',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop',
    likes: 189,
    comments: 24,
    caption: 'Exploring new horizons 🌅',
    isLiked: false,
  },
  {
    id: 'p4',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
    likes: 312,
    comments: 28,
    caption: "Nature's beauty 🌲",
    isLiked: false,
  },
  {
    id: 'p5',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=600&fit=crop',
    likes: 278,
    comments: 15,
    caption: 'Waterfall adventures 💧',
    isLiked: false,
  },
  {
    id: 'p6',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop',
    likes: 198,
    comments: 21,
    caption: 'Misty mornings 🌫️',
    isLiked: false,
  },
];

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
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
};

/**
 * Transition presets for animations
 */
export const TRANSITIONS = {
  default: { duration: 0.3 },
  fast: { duration: 0.2 },
  slow: { duration: 0.4 },
  spring: { type: 'spring', damping: 25, stiffness: 200 },
  springBouncy: { type: 'spring', damping: 20, stiffness: 300 },
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
  '2xl': 1536,
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
 * Border radius design tokens for consistent rounded corners
 */
export const BORDER_RADIUS = {
  // Base values (Tailwind class equivalents)
  none: 'rounded-none',
  sm: 'rounded-sm',
  base: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',

  // Semantic tokens for specific use cases
  card: 'rounded-xl', // Standard card border-radius
  cardLarge: 'rounded-2xl', // Large cards (featured content, theater mode)
  cardSmall: 'rounded-lg', // Small cards and compact components
  button: 'rounded-full', // Buttons and interactive elements
  input: 'rounded-full', // Input fields and text areas
  badge: 'rounded-full', // Badges and pills
  avatar: 'rounded-full', // Avatar images
  modal: 'rounded-2xl', // Modal dialogs
  dropdown: 'rounded-xl', // Dropdown menus and popovers
  image: 'rounded-lg', // Standalone images
  commentBubble: 'rounded-lg sm:rounded-xl', // Comment bubbles with responsive sizing
};

/**
 * App metadata
 */
export const APP_CONFIG = {
  name: 'Orbit',
  tagline: 'Connect • Discover • Thrive',
  year: 2026,
};

export default {
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
  TEXTAREA_MIN_HEIGHT,
  TEXTAREA_MAX_HEIGHT,
  DEFAULT_AVATAR_URL,
  PROFILE_DATA,
  INITIAL_PROFILE_POSTS,
  ANIMATION_VARIANTS,
  TRANSITIONS,
  BREAKPOINTS,
  Z_INDEX,
  BORDER_RADIUS,
  APP_CONFIG,
};
