/**
 * useFeedActions Hook
 * Extracts business logic for feed operations
 * Decouples action handlers from context state management
 *
 * This hook consumes the FeedContext to access state and setters,
 * then provides business logic methods to components.
 */

import { useCallback } from 'react';
import { useFeed } from '../context/AppContext';
import { useNotificationPopup } from '../context/providers/ui';
import {
  createPost,
  toggleLikeById,
  incrementSharesById,
  incrementCommentsById,
  createComment,
  toggleCommentVisibility,
  copyPostUrlToClipboard,
} from '../services/postService';
import { processImageFile } from '../utils/fileUtils';

/**
 * Custom hook for feed action handlers
 * Consumes FeedContext and provides business logic methods
 *
 * @returns {Object} Object containing all feed action handlers
 */
export const useFeedActions = () => {
  // Access feed state and setters from context
  const {
    currentUser,
    posts,
    newComment,
    newPostContent,
    selectedImage,
    setPosts,
    setComments,
    setShowComments,
    setNewComment,
    setNewPostContent,
    setSelectedImage,
    setSelectedPost,
  } = useFeed();

  // Access notification popup from focused UI context
  // This properly handles timeout cleanup and prevents memory leaks
  const { showCopyNotificationWithTimeout } = useNotificationPopup();

  /**
   * Handle like action on a post
   */
  const handleLike = useCallback(
    (postId) => {
      setPosts((prev) => toggleLikeById(prev, postId));
    },
    [setPosts]
  );

  /**
   * Handle comment toggle action on a post
   */
  const handleComment = useCallback(
    (postId) => {
      setShowComments((prev) => toggleCommentVisibility(prev, postId));
    },
    [setShowComments]
  );

  /**
   * Handle adding a new comment to a post
   */
  const handleAddComment = useCallback(
    (postId) => {
      const commentText = newComment[postId];
      if (!commentText?.trim()) return;

      const newCommentObj = createComment({
        user: currentUser,
        content: commentText,
        postId,
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      setPosts((prev) => incrementCommentsById(prev, postId));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    },
    [newComment, currentUser, setComments, setPosts, setNewComment]
  );

  /**
   * Handle share action on a post
   * Uses the centralized notification popup handler to prevent memory leaks
   */
  const handleShare = useCallback(
    async (postId) => {
      const success = await copyPostUrlToClipboard(postId);
      setPosts((prev) => incrementSharesById(prev, postId));

      // Use the centralized handler that properly manages timeouts
      showCopyNotificationWithTimeout('Link copied to clipboard');

      return success;
    },
    [setPosts, showCopyNotificationWithTimeout]
  );

  /**
   * Handle creating a new post
   */
  const handleCreatePost = useCallback(() => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost = createPost({
      user: currentUser,
      content: newPostContent,
      image: selectedImage,
      category: 'Personal',
    });

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedImage(null);
  }, [newPostContent, selectedImage, currentUser, setPosts, setNewPostContent, setSelectedImage]);

  /**
   * Handle image upload for new post
   */
  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      const dataUrl = await processImageFile(file);
      if (dataUrl) {
        setSelectedImage(dataUrl);
      }
    },
    [setSelectedImage]
  );

  /**
   * Handle post click action
   */
  const handlePostClick = useCallback(
    (postId) => {
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    },
    [posts, setSelectedPost]
  );

  /**
   * Clear selected post
   */
  const clearSelectedPost = useCallback(() => {
    setSelectedPost(null);
  }, [setSelectedPost]);

  return {
    handleLike,
    handleComment,
    handleAddComment,
    handleShare,
    handleCreatePost,
    handleImageUpload,
    handlePostClick,
    clearSelectedPost,
  };
};

export default useFeedActions;
