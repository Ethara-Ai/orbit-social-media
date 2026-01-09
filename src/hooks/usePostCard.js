/**
 * usePostCard Facade Hook
 * Simplifies PostCard component dependencies
 * Provides a single interface for all post card related data and actions
 *
 * This facade consolidates multiple dependencies:
 * - State from FeedContext
 * - Actions from useFeedActions hook
 * - User data from UserContext
 */

import { useFeed, useUser } from '../context/AppContext';
import { useFeedActions } from './useFeedActions';

/**
 * Facade hook for PostCard component
 * Consolidates multiple context dependencies into a single interface
 *
 * @returns {Object} Object containing all data and actions needed by PostCard
 */
export const usePostCard = () => {
  // Access feed state from context
  const { comments, showComments, newComment, setNewComment } = useFeed();

  // Access feed actions from hook
  const { handleLike, handleComment, handleAddComment, handlePostClick } = useFeedActions();

  // Access user data from context
  const { currentUser, currentUserAvatar } = useUser();

  // Return consolidated interface
  return {
    // User data
    currentUser,
    currentUserAvatar,
    // Feed state
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
