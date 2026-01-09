/**
 * useFeedActions Hook
 * Extracts business logic for feed operations
 * Decouples action handlers from context state management
 *
 * This hook consumes the FeedContext to access state and setters,
 * then provides business logic methods to components.
 */

import { useCallback } from 'react';
import { useFeed, useUser, usePosts } from '../context/AppContext';
import { useNotificationPopup } from '../context/providers/ui';
import {
  createPost,
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
    selectedImages,
    setPosts,
    setComments,
    setShowComments,
    setNewComment,
    setNewPostContent,
    setSelectedImages,
    setSelectedPost,
  } = useFeed();

  // Access user data from UserContext to ensure we use the latest profile info
  const { currentUserAvatar, currentUserDetails } = useUser();

  // Access unified post actions from PostsContext for synced data across feed and explore
  const { togglePostLike, incrementPostComments } = usePosts();

  // Access notification popup from focused UI context
  // This properly handles timeout cleanup and prevents memory leaks
  const { showCopyNotificationWithTimeout } = useNotificationPopup();

  /**
   * Handle like action on a post
   * Uses unified togglePostLike to sync across feed and explore
   */
  const handleLike = useCallback(
    (postId) => {
      togglePostLike(postId);
    },
    [togglePostLike]
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

      // Create a user object that reflects the current profile state
      const postingUser = {
        ...currentUser,
        ...currentUserDetails, // Overwrite name, profession, etc.
        avatar: currentUserAvatar, // Overwrite avatar
      };

      const newCommentObj = createComment({
        user: postingUser,
        content: commentText,
        postId,
      });

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      // Update comments count in unified posts state
      incrementPostComments(postId);

      // Also update local feed posts for immediate UI update
      setPosts((prev) => incrementCommentsById(prev, postId));

      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    },
    [
      newComment,
      currentUser,
      currentUserDetails,
      currentUserAvatar,
      setComments,
      setPosts,
      setNewComment,
      incrementPostComments,
    ]
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
    if (!newPostContent.trim() && selectedImages.length === 0) return;

    // Create a user object that reflects the current profile state
    const postingUser = {
      ...currentUser,
      ...currentUserDetails, // Overwrite name, profession, etc.
      avatar: currentUserAvatar, // Overwrite avatar
    };

    const newPost = createPost({
      user: postingUser,
      content: newPostContent,
      images: selectedImages,
      // For backward compatibility
      image: selectedImages[0] || null,
      category: 'Personal',
    });

    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedImages([]);
  }, [
    newPostContent,
    selectedImages,
    currentUser,
    currentUserDetails,
    currentUserAvatar,
    setPosts,
    setNewPostContent,
    setSelectedImages,
  ]);

  /**
   * Handle image upload for new post
   */
  const handleImageUpload = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const processedImages = await Promise.all(
        files.map(async (file) => {
          return await processImageFile(file);
        })
      );

      // Filter out any failed uploads (nulls)
      const validImages = processedImages.filter((img) => img !== null);

      if (validImages.length > 0) {
        setSelectedImages((prev) => [...prev, ...validImages]);
      }

      // Reset input so same files can be selected again if needed
      event.target.value = '';
    },
    [setSelectedImages]
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
