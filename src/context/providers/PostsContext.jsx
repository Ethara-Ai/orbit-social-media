/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Import Repositories
import postRepository from '../../data/repositories/PostRepository';
import exploreRepository from '../../data/repositories/ExploreRepository';

// ============================================================================
// Context Definition
// ============================================================================

const PostsContext = createContext(null);
PostsContext.displayName = 'PostsContext';

// ============================================================================
// Posts Provider
// Centralized post management for the entire application
//
// Responsibilities:
// - Manage all posts (feed and explore) in a unified state
// - Ensure data consistency across different views
// - Provide methods to update posts that sync everywhere
//
// Design Principle:
// Single source of truth for post data. When a post is liked/unliked or
// modified in any way, the change propagates to all views automatically.
// ============================================================================

export function PostsProvider({ children }) {
  // ==========================================================================
  // Initialize Data from Repositories
  // ==========================================================================
  const initialData = useMemo(() => {
    const feedPosts = postRepository.getPosts();
    const explorePosts = exploreRepository.getPosts();

    // Create a map of all posts by ID for efficient lookups and updates
    const postsById = new Map();

    // Add feed posts
    feedPosts.forEach((post) => {
      postsById.set(post.id, { ...post, source: 'feed' });
    });

    // Add explore posts
    explorePosts.forEach((post) => {
      postsById.set(post.id, { ...post, source: 'explore' });
    });

    return {
      feedPosts,
      explorePosts,
      postsById,
    };
  }, []);

  // ==========================================================================
  // Posts State
  // Maintain separate arrays for feed and explore, but sync updates via Map
  // ==========================================================================
  const [feedPosts, setFeedPosts] = useState(initialData.feedPosts);
  const [explorePosts, setExplorePosts] = useState(initialData.explorePosts);
  const [postsMap, setPostsMap] = useState(initialData.postsById);

  // ==========================================================================
  // Update Handlers - Core Logic for Syncing Posts
  // ==========================================================================

  /**
   * Update a post by ID across all views
   * This is the central function that ensures data consistency
   */
  const updatePostById = useCallback((postId, updateFn) => {
    // Update in the map
    setPostsMap((prevMap) => {
      const newMap = new Map(prevMap);
      const post = newMap.get(postId);
      if (post) {
        newMap.set(postId, updateFn(post));
      }
      return newMap;
    });

    // Update in feed posts if it exists there
    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updateFn(post) : post))
    );

    // Update in explore posts if it exists there
    setExplorePosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updateFn(post) : post))
    );
  }, []);

  /**
   * Toggle like status for a post
   * Syncs across feed and explore views
   */
  const togglePostLike = useCallback(
    (postId) => {
      updatePostById(postId, (post) => ({
        ...post,
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1,
      }));
    },
    [updatePostById]
  );

  /**
   * Update post likes count (for manual updates)
   */
  const updatePostLikes = useCallback(
    (postId, likesCount) => {
      updatePostById(postId, (post) => ({
        ...post,
        likes: likesCount,
      }));
    },
    [updatePostById]
  );

  /**
   * Update post comments count
   */
  const updatePostComments = useCallback(
    (postId, commentsCount) => {
      updatePostById(postId, (post) => ({
        ...post,
        comments: commentsCount,
      }));
    },
    [updatePostById]
  );

  /**
   * Increment post comments count
   */
  const incrementPostComments = useCallback(
    (postId) => {
      updatePostById(postId, (post) => ({
        ...post,
        comments: (post.comments || 0) + 1,
      }));
    },
    [updatePostById]
  );

  /**
   * Get post by ID from the unified map
   */
  const getPostById = useCallback(
    (postId) => {
      return postsMap.get(postId) || null;
    },
    [postsMap]
  );

  /**
   * Update multiple posts at once
   */
  const updatePosts = useCallback((updates) => {
    setPostsMap((prevMap) => {
      const newMap = new Map(prevMap);
      updates.forEach(({ postId, updateFn }) => {
        const post = newMap.get(postId);
        if (post) {
          newMap.set(postId, updateFn(post));
        }
      });
      return newMap;
    });

    setFeedPosts((prevPosts) =>
      prevPosts.map((post) => {
        const update = updates.find((u) => u.postId === post.id);
        return update ? update.updateFn(post) : post;
      })
    );

    setExplorePosts((prevPosts) =>
      prevPosts.map((post) => {
        const update = updates.find((u) => u.postId === post.id);
        return update ? update.updateFn(post) : post;
      })
    );
  }, []);

  // ==========================================================================
  // Context Value
  //
  // Exposes:
  // - Read-only post data for feed and explore
  // - Update methods that sync across all views
  // - Utility methods for common operations
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      feedPosts,
      explorePosts,
      postsMap,

      // Update Methods
      updatePostById,
      togglePostLike,
      updatePostLikes,
      updatePostComments,
      incrementPostComments,
      updatePosts,

      // Utility Methods
      getPostById,

      // Direct Setters (use with caution, prefer update methods)
      setFeedPosts,
      setExplorePosts,
    }),
    [
      feedPosts,
      explorePosts,
      postsMap,
      updatePostById,
      togglePostLike,
      updatePostLikes,
      updatePostComments,
      incrementPostComments,
      updatePosts,
      getPostById,
    ]
  );

  return <PostsContext.Provider value={contextValue}>{children}</PostsContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}

export default PostsContext;
