/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Import Data
import { currentUser } from '../../data/mockData';
import postRepository from '../../data/repositories/PostRepository';

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
  const initialPosts = useMemo(() => postRepository.getPosts(), []);
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
  const [posts, setPosts] = useState(initialPosts);
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // ==========================================================================
  // Feed Action Handlers (Business Logic)
  // ==========================================================================
  const handleLike = useCallback((postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const handleComment = useCallback((postId) => {
    setShowComments((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  }, []);

  const handleAddComment = useCallback(
    (postId) => {
      const commentText = newComment[postId]?.trim();
      if (!commentText) return;

      const newCommentObj = {
        id: `c${Date.now()}`,
        user: currentUser,
        content: commentText,
        timestamp: 'Just now',
        postId,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comments: (post.comments || 0) + 1 } : post
        )
      );

      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    },
    [newComment]
  );

  const handleShare = useCallback(() => {
    // Copy to clipboard functionality handled separately
  }, []);

  const handleCreatePost = useCallback(() => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost = {
      id: `p${Date.now()}`,
      user: currentUser,
      content: newPostContent,
      image: selectedImage,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      isLiked: false,
      category: 'General',
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedImage(null);
  }, [newPostContent, selectedImage]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePostClick = useCallback(
    (postId) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    },
    [posts]
  );

  const clearSelectedPost = useCallback(() => {
    setSelectedPost(null);
  }, []);

  // ==========================================================================
  // Context Value
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
