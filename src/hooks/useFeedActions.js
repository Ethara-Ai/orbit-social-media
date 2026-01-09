/**
 * useFeedActions Hook
 * Extracts business logic for feed operations
 * Decouples action handlers from context state management
 */

import { useCallback } from "react";
import {
  createPost,
  toggleLikeById,
  incrementSharesById,
  incrementCommentsById,
  addPost,
  createComment,
  addComment,
  toggleCommentVisibility,
  copyPostUrlToClipboard,
} from "../services/postService";
import { processImageFile } from "../utils/fileUtils";
import { COPY_NOTIFICATION_DURATION } from "../utils/constants";

/**
 * Custom hook for feed action handlers with organized parameter structure
 * @param {Object} params - Hook parameters
 * @param {Object} params.currentUser - Current user object
 * @param {Object} params.state - State values
 * @param {string} params.state.newPostContent - New post content string
 * @param {string|null} params.state.selectedImage - Selected image data URL
 * @param {Object} params.state.newComment - New comment state object
 * @param {Object} params.setState - State setters grouped by domain
 * @param {Function} params.setState.setPosts - Function to update posts state
 * @param {Function} params.setState.setComments - Function to update comments state
 * @param {Function} params.setState.setShowComments - Function to update show comments state
 * @param {Function} params.setState.setNewComment - Function to update new comment state
 * @param {Function} params.setState.setNewPostContent - Function to update new post content state
 * @param {Function} params.setState.setSelectedImage - Function to update selected image state
 * @param {Function} params.setState.setSelectedPost - Function to update selected post state
 * @param {Object} params.ui - UI-related state and setters
 * @param {Function} params.ui.setShowCopyNotification - Function to update copy notification state
 * @returns {Object} Object containing all feed action handlers
 */
export const useFeedActions = ({
  currentUser,
  state: { newPostContent, selectedImage, newComment },
  setState: {
    setPosts,
    setComments,
    setShowComments,
    setNewComment,
    setNewPostContent,
    setSelectedImage,
    setSelectedPost,
  },
  ui: { setShowCopyNotification },
}) => {
  /**
   * Handle like action on a post
   */
  const handleLike = useCallback(
    (postId) => {
      setPosts((prev) => toggleLikeById(prev, postId));
    },
    [setPosts],
  );

  /**
   * Handle comment toggle action on a post
   */
  const handleComment = useCallback(
    (postId) => {
      setShowComments((prev) => toggleCommentVisibility(prev, postId));
    },
    [setShowComments],
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

      setComments((prev) => addComment(prev, newCommentObj));
      setPosts((prev) => incrementCommentsById(prev, postId));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    },
    [newComment, currentUser, setComments, setPosts, setNewComment],
  );

  /**
   * Handle share action on a post
   */
  const handleShare = useCallback(
    async (postId) => {
      const success = await copyPostUrlToClipboard(postId);
      setPosts((prev) => incrementSharesById(prev, postId));
      setShowCopyNotification(true);
      setTimeout(
        () => setShowCopyNotification(false),
        COPY_NOTIFICATION_DURATION,
      );
      return success;
    },
    [setPosts, setShowCopyNotification],
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
      category: "Personal",
    });

    setPosts((prev) => addPost(prev, newPost));
    setNewPostContent("");
    setSelectedImage(null);
  }, [
    newPostContent,
    selectedImage,
    currentUser,
    setPosts,
    setNewPostContent,
    setSelectedImage,
  ]);

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
    [setSelectedImage],
  );

  /**
   * Handle post click action
   */
  const handlePostClick = useCallback(
    (postId) => {
      console.log("Post clicked:", postId);
      setSelectedPost(postId);
    },
    [setSelectedPost],
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
