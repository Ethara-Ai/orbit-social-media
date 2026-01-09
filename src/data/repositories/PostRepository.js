/**
 * Post Repository
 * Manages post data initialization and access
 * Decouples data layer from state management
 */

import { createMockPosts, createInitialComments, friends } from '../mockData';

/**
 * PostRepository Class
 * Singleton pattern for managing post-related data
 */
class PostRepository {
  constructor() {
    this._posts = null;
    this._comments = null;
  }

  /**
   * Initialize posts data
   * @returns {Array} Array of posts
   */
  initializePosts() {
    if (!this._posts) {
      this._posts = createMockPosts(friends);
    }
    return this._posts;
  }

  /**
   * Initialize comments data
   * @returns {Array} Array of comments
   */
  initializeComments() {
    if (!this._comments) {
      this._comments = createInitialComments(friends);
    }
    return this._comments;
  }

  /**
   * Get all posts
   * @returns {Array} Array of posts
   */
  getPosts() {
    return this.initializePosts();
  }

  /**
   * Get all comments
   * @returns {Array} Array of comments
   */
  getComments() {
    return this.initializeComments();
  }

  /**
   * Get comments for a specific post
   * @param {string} postId - Post ID
   * @returns {Array} Array of comments for the post
   */
  getCommentsForPost(postId) {
    const comments = this.getComments();
    return comments.filter((comment) => comment.postId === postId);
  }

  /**
   * Get post by ID
   * @param {string} postId - Post ID
   * @returns {Object|null} Post object or null if not found
   */
  getPostById(postId) {
    const posts = this.getPosts();
    return posts.find((post) => post.id === postId) || null;
  }

  /**
   * Reset repository data (useful for testing)
   */
  reset() {
    this._posts = null;
    this._comments = null;
  }
}

// Create singleton instance
const postRepository = new PostRepository();

// Export singleton instance
export default postRepository;

// Also export class for testing purposes
export { PostRepository };
