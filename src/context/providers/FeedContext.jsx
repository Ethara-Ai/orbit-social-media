/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';

// Import Data
import { currentUser } from '../../data/mockData';

// ============================================================================
// Context Definition
// ============================================================================

const FeedContext = createContext(null);

// ============================================================================
// Feed Provider
// Self-contained provider managing feed-related state
// Business logic extracted to useFeedActions hook
//
// Encapsulation Strategy:
// - Form-related setters (setNewComment, setNewPostContent, setSelectedImage)
//   are exposed for controlled input components
// - Critical state setters (setPosts, setComments, etc.) are kept internal
//   and only accessible through actions for better encapsulation
// ============================================================================

export function FeedProvider({ children }) {
  // ==========================================================================
  // Initialize Data from Repository
  // ==========================================================================
  // TODO: Replace with actual data fetching
  const initialPosts = useMemo(() => [], []);
  const initialComments = useMemo(() => ({}), []);

  // ==========================================================================
  // Feed State
  // ==========================================================================
  const [posts, _setPosts] = useState(initialPosts);
  const [comments, _setComments] = useState(initialComments);
  const [showComments, _setShowComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPost, _setSelectedPost] = useState(null);

  // ==========================================================================
  // Feed Action Handlers (Business Logic)
  // Organized parameter structure for better maintainability
  // ==========================================================================
  // Feed Action Handlers - memoized to prevent unnecessary re-renders
  const handleLike = useMemo(() => () => {}, []);
  const handleComment = useMemo(() => () => {}, []);
  const handleAddComment = useMemo(() => () => {}, []);
  const handleShare = useMemo(() => () => {}, []);
  const handleCreatePost = useMemo(() => () => {}, []);
  const handleImageUpload = useMemo(() => () => {}, []);
  const handlePostClick = useMemo(() => () => {}, []);
  const clearSelectedPost = useMemo(() => () => {}, []);

  // ==========================================================================
  // Context Value
  //
  // Exposed to consumers:
  // - Read-only data (posts, comments, etc.)
  // - Form setters (for controlled inputs)
  // - Actions (encapsulated state changes)
  //
  // Kept internal (not exposed):
  // - setPosts, setComments, setShowComments (use actions instead)
  // - setSelectedPost (use handlePostClick/clearSelectedPost)
  // - setShowCopyNotification (managed by handleShare action)
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      currentUser,
      posts,
      comments,
      showComments,
      newComment,
      newPostContent,
      selectedImage,
      selectedPost,

      // Form Setters (for controlled inputs)
      setNewComment,
      setNewPostContent,
      setSelectedImage,
      // Actions (encapsulate complex state changes)
      handleLike,
      handleComment,
      handleAddComment,
      handleShare,
      handleCreatePost,
      handleImageUpload,
      handlePostClick,
      clearSelectedPost,
    }),
    [
      posts,
      comments,
      showComments,
      newComment,
      newPostContent,
      selectedImage,
      selectedPost,
      handleLike,
      handleComment,
      handleAddComment,
      handleShare,
      handleCreatePost,
      handleImageUpload,
      handlePostClick,
      clearSelectedPost,
    ]
  );

  return <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}

export default FeedContext;
