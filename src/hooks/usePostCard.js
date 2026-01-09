/**
 * usePostCard Facade Hook
 * Simplifies PostCard component dependencies
 * Provides a single interface for all post card related data and actions
 */

import { useFeed } from "../context/AppContext";
import { useUser } from "../context/AppContext";

/**
 * Facade hook for PostCard component
 * Consolidates multiple context dependencies into a single interface
 *
 * @returns {Object} Object containing all data and actions needed by PostCard
 */
export const usePostCard = () => {
  // Access feed state and actions
  const {
    comments,
    showComments,
    newComment,
    setNewComment,
    handleLike,
    handleComment,
    handleAddComment,
    handlePostClick,
  } = useFeed();

  // Access user data
  const { currentUser, currentUserAvatar } = useUser();

  // Return consolidated interface
  return {
    // User data
    currentUser,
    currentUserAvatar,
    // Feed data
    comments,
    showComments,
    newComment,
    // Setters
    setNewComment,
    // Actions
    handleLike,
    handleComment,
    handleAddComment,
    handlePostClick,
  };
};

export default usePostCard;
