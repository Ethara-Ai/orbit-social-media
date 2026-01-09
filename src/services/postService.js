/**
 * Post Service
 * Handles post-related business logic for feed and explore sections
 */

/**
 * Create a new post object
 * @param {Object} options - Post options
 * @param {Object} options.user - User creating the post
 * @param {string} options.content - Post content text
 * @param {string|null} options.image - Optional image URL
 * @param {string} options.category - Post category, default 'General'
 * @returns {Object} New post object
 */
export const createPost = ({ user, content, image = null, category = 'General' }) => {
  return {
    id: Date.now().toString(),
    user,
    content,
    image: image || undefined,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: 'Just now',
    isLiked: false,
    category,
  };
};

/**
 * Toggle like status on a post
 * @param {Object} post - Post to toggle like on
 * @returns {Object} Updated post with toggled like status
 */
export const toggleLike = (post) => {
  return {
    ...post,
    isLiked: !post.isLiked,
    likes: post.isLiked ? post.likes - 1 : post.likes + 1,
  };
};

/**
 * Increment share count on a post
 * @param {Object} post - Post to increment shares on
 * @returns {Object} Updated post with incremented shares
 */
export const incrementShares = (post) => {
  return {
    ...post,
    shares: post.shares + 1,
  };
};

/**
 * Increment comment count on a post
 * @param {Object} post - Post to increment comments on
 * @returns {Object} Updated post with incremented comments
 */
export const incrementComments = (post) => {
  return {
    ...post,
    comments: post.comments + 1,
  };
};

/**
 * Update a post in a posts array by ID
 * @param {Array} posts - Array of posts
 * @param {string} postId - ID of post to update
 * @param {Function} updateFn - Function that receives post and returns updated post
 * @returns {Array} Updated posts array
 */
export const updatePostById = (posts, postId, updateFn) => {
  return posts.map((post) => (post.id === postId ? updateFn(post) : post));
};

/**
 * Toggle like on a post in a posts array
 * @param {Array} posts - Array of posts
 * @param {string} postId - ID of post to toggle like on
 * @returns {Array} Updated posts array
 */
export const toggleLikeById = (posts, postId) => {
  return updatePostById(posts, postId, toggleLike);
};

/**
 * Increment shares on a post in a posts array
 * @param {Array} posts - Array of posts
 * @param {string} postId - ID of post to increment shares on
 * @returns {Array} Updated posts array
 */
export const incrementSharesById = (posts, postId) => {
  return updatePostById(posts, postId, incrementShares);
};

/**
 * Increment comments on a post in a posts array
 * @param {Array} posts - Array of posts
 * @param {string} postId - ID of post to increment comments on
 * @returns {Array} Updated posts array
 */
export const incrementCommentsById = (posts, postId) => {
  return updatePostById(posts, postId, incrementComments);
};

/**
 * Add a new post to the beginning of a posts array
 * @param {Array} posts - Current posts array
 * @param {Object} newPost - New post to add
 * @returns {Array} Updated posts array with new post at the beginning
 */
export const addPost = (posts, newPost) => {
  return [newPost, ...posts];
};

/**
 * Filter posts by category
 * @param {Array} posts - Array of posts to filter
 * @param {string|null} category - Category to filter by, null for all posts
 * @param {Array} categories - Array of category objects with id and name
 * @returns {Array} Filtered posts array
 */
export const filterByCategory = (posts, categoryId, categories) => {
  if (!categoryId) return posts;

  const category = categories.find((c) => c.id === categoryId);
  if (!category) return posts;

  return posts.filter((post) => post.category === category.name);
};

/**
 * Get featured posts (popular ones)
 * @param {Array} posts - Array of posts
 * @param {number} limit - Maximum number of featured posts to return
 * @returns {Array} Featured posts array
 */
export const getFeaturedPosts = (posts, limit = 2) => {
  return posts.filter((post) => post.isPopular).slice(0, limit);
};

/**
 * Get regular posts (excluding featured)
 * @param {Array} posts - Array of posts
 * @param {Array} featuredPosts - Array of featured posts to exclude
 * @returns {Array} Regular posts array
 */
export const getRegularPosts = (posts, featuredPosts) => {
  const featuredIds = new Set(featuredPosts.map((p) => p.id));
  return posts.filter((post) => !featuredIds.has(post.id));
};

/**
 * Create a comment object
 * @param {Object} options - Comment options
 * @param {Object} options.user - User creating the comment
 * @param {string} options.content - Comment content
 * @param {string} options.postId - ID of post being commented on
 * @returns {Object} New comment object
 */
export const createComment = ({ user, content, postId }) => {
  return {
    id: `c${Date.now()}`,
    user,
    content,
    timestamp: 'Just now',
    postId,
  };
};

/**
 * Add a comment to a comments array
 * @param {Array} comments - Current comments array
 * @param {Object} newComment - New comment to add
 * @returns {Array} Updated comments array
 */
export const addComment = (comments, newComment) => {
  return [...comments, newComment];
};

/**
 * Get comments for a specific post
 * @param {Array} comments - All comments array
 * @param {string} postId - ID of post to get comments for
 * @returns {Array} Comments for the specified post
 */
export const getCommentsForPost = (comments, postId) => {
  return comments.filter((comment) => comment.postId === postId);
};

/**
 * Toggle comment visibility for a post
 * @param {Array} visibleComments - Array of post IDs with visible comments
 * @param {string} postId - Post ID to toggle comments for
 * @returns {Array} Updated visible comments array
 */
export const toggleCommentVisibility = (visibleComments, postId) => {
  return visibleComments.includes(postId)
    ? visibleComments.filter((id) => id !== postId)
    : [...visibleComments, postId];
};

/**
 * Generate a shareable post URL
 * @param {string} postId - ID of post to share
 * @param {string} baseUrl - Base URL of the application
 * @returns {string} Shareable URL
 */
export const generateShareUrl = (postId, baseUrl = window.location.origin) => {
  return `${baseUrl}/post/${postId}`;
};

/**
 * Copy post URL to clipboard
 * @param {string} postId - ID of post to share
 * @returns {Promise<boolean>} Whether copy was successful
 */
export const copyPostUrlToClipboard = async (postId) => {
  try {
    const url = generateShareUrl(postId);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    // Only log errors in development mode
    if (import.meta.env.DEV) {
      console.error('Failed to copy link:', err);
    }
    return false;
  }
};

export default {
  createPost,
  toggleLike,
  incrementShares,
  incrementComments,
  updatePostById,
  toggleLikeById,
  incrementSharesById,
  incrementCommentsById,
  addPost,
  filterByCategory,
  getFeaturedPosts,
  getRegularPosts,
  createComment,
  addComment,
  getCommentsForPost,
  toggleCommentVisibility,
  generateShareUrl,
  copyPostUrlToClipboard,
};
