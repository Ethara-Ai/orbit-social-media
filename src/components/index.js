// Icons
export * from "./icons";

// Common Components
export { Avatar, EmptyState, Badge, ActionButton } from "./common";

// Layout Components
export { default as LoadingScreen } from "./layout/LoadingScreen";
export { default as Sidebar } from "./layout/Sidebar";
export { default as Header } from "./layout/Header";
export { default as MainContent } from "./layout/MainContent";
export { default as MobileNavOverlay } from "./layout/MobileNavOverlay";
export { default as RightSidebar } from "./layout/RightSidebar";

// Layout Popup Components
export { CopyNotificationPopup, NotificationPopup } from "./layout/popups";

// Layout RightSidebar Sub-components
export {
  ActiveNowSection,
  SuggestedUsersSection,
} from "./layout/RightSidebar/index";

// Sidebar Sub-components
export {
  UserProfileCard,
  NavigationItems,
  ConnectionsList,
  FriendItem,
} from "./sidebar";

// Feed Components
export { default as FeedTab } from "./feed/FeedTab";
export { default as PostCard } from "./feed/PostCard";
export { default as CreatePost } from "./feed/CreatePost";

// Post Sub-components
export {
  PostHeader,
  PostContent,
  PostActions,
  PostComments,
} from "./feed/post";

// Explore Components
export { default as ExploreTab } from "./explore/ExploreTab";
export {
  CategoryPills,
  CategoryPill,
  FeaturedPostCard,
  ExplorePostCard,
  NewBadge,
  HoverOverlay,
  ExploreHeader,
  FeaturedSection,
  RegularPostsGrid,
} from "./explore";

// Explore Modal Components
export {
  TheaterModal,
  TheaterHeader,
  TheaterContent,
  TheaterActionBar,
  ActionButton as TheaterActionButton,
} from "./explore/modal";
export {
  CommentsPanel,
  CommentsPanelHeader,
  CommentsList,
  CommentItem,
  CommentInput,
} from "./explore/modal";

// Messages Components
export { default as MessagesTab } from "./messages/MessagesTab";

// Messages Chat Sub-components
export {
  default as ConversationsList,
  ConversationsHeader,
  ConversationItem,
  UnreadBadge,
  EmptySearchState,
} from "./messages/chat/ConversationsList";
export { default as ChatHeader } from "./messages/chat/ChatHeader";
export {
  default as MessageBubble,
  MessageAttachment,
  MessageTimestamp,
} from "./messages/chat/MessageBubble";
export {
  default as MessageInput,
  AttachmentPreview,
} from "./messages/chat/MessageInput";
export {
  default as ActiveChat,
  MessagesList,
} from "./messages/chat/ActiveChat";
export { default as EmptyChatState } from "./messages/chat/EmptyChatState";

// Notifications Components
export { default as NotificationsTab } from "./notifications/NotificationsTab";
export {
  NotificationsHeader,
  NotificationItem,
  NotificationAvatar,
  NotificationIconBadge,
  NotificationContent,
  UnreadDot,
  NotificationsFooter,
  getNotificationIconConfig,
} from "./notifications/NotificationsTab";
