/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';

// Import Data
import { currentUser } from '../../data/mockData';
import postRepository from '../../data/repositories/PostRepository';
import { usePosts } from './PostsContext';

// ============================================================================
// Context Definition
// ============================================================================

const FeedContext = createContext(null);
FeedContext.displayName = 'FeedContext';

// ============================================================================
// Feed Provider
// Pure state management provider - no business logic
//
// Responsibilities:
// - Initialize and manage feed state (posts, comments, etc.)
// - Expose state and setters for components and action hooks
// - Keep business logic in separate action hooks (useFeedActions)
//
// Design Principle:
// This provider follows the principle of separation of concerns by managing
// ONLY state. Business logic is delegated to action hooks that consume this
// context and provide methods to components.
// ============================================================================

export function FeedProvider({ children }) {
  // ==========================================================================
  // Get unified posts from PostsContext
  // ==========================================================================
  const { feedPosts: posts, setFeedPosts: setPosts } = usePosts();

  // ==========================================================================
  // Initialize Data from Repository
  // ==========================================================================
  const initialComments = useMemo(() => {
    const commentsArray = postRepository.getComments();
    // Convert array to object grouped by postId
    return commentsArray.reduce((acc, comment) => {
      const postId = comment.postId;
      if (!acc[postId]) {
        acc[postId] = [];
      }
      acc[postId].push(comment);
      return acc;
    }, {});
  }, []);

  // ==========================================================================
  // Feed State
  // ==========================================================================
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // ==========================================================================
  // Context Value
  //
  // Exposes:
  // - Read-only data (currentUser, posts, comments, etc.)
  // - All state setters for maximum flexibility
  //
  // Business logic is NOT included here - components should use
  // useFeedActions hook which consumes this context
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
      selectedImages,
      selectedPost,

      // State Setters
      setPosts,
      setComments,
      setShowComments,
      setNewComment,
      setNewPostContent,
      setSelectedImages,
      setSelectedPost,
    }),
    [
      posts,
      comments,
      showComments,
      newComment,
      newPostContent,
      selectedImages,
      selectedPost,
      setPosts,
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
