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
 * Custom hook for feed action handlers
 * @param {Object} params - Hook parameters
 * @param {Object} params.currentUser - Current user object
 * @param {Function} params.setPosts - Function to update posts state
 * @param {Function} params.setComments - Function to update comments state
 * @param {Function} params.setShowComments - Function to update show comments state
 * @param {Function} params.setNewComment - Function to update new comment state
 * @param {Function} params.setNewPostContent - Function to update new post content state
 * @param {Function} params.setSelectedImage - Function to update selected image state
 * @param {Function} params.setSelectedPost - Function to update selected post state
 * @param {Function} params.setShowCopyNotification - Function to update copy notification state
 * @param {Object} params.newComment - New comment state object
 * @param {string} params.newPostContent - New post content string
 * @param {string|null} params.selectedImage - Selected image data URL
 * @returns {Object} Object containing all feed action handlers
 */
export const useFeedActions = ({
  currentUser,
  setPosts,
  setComments,
  setShowComments,
  setNewComment,
  setNewPostContent,
  setSelectedImage,
  setSelectedPost,
  setShowCopyNotification,
  newComment,
  newPostContent,
  selectedImage,
}) => {
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

      setComments((prev) => addComment(prev, newCommentObj));
      setPosts((prev) => incrementCommentsById(prev, postId));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    },
    [newComment, currentUser, setComments, setPosts, setNewComment]
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
        COPY_NOTIFICATION_DURATION
      );
      return success;
    },
    [setPosts, setShowCopyNotification]
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
    [setSelectedImage]
  );

  /**
   * Handle post click action
   */
  const handlePostClick = useCallback(
    (postId) => {
      console.log("Post clicked:", postId);
      setSelectedPost(postId);
    },
    [setSelectedPost]
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
