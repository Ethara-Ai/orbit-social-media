/**
 * Explore Repository
 * Manages explore section data initialization and access
 * Decouples data layer from state management
 */

import { createExplorePosts, exploreCategories, friends } from "../mockData";

/**
 * ExploreRepository Class
 * Singleton pattern for managing explore-related data
 */
class ExploreRepository {
  constructor() {
    this._posts = null;
    this._categories = null;
  }

  /**
   * Initialize explore posts data
   * @returns {Array} Array of explore posts
   */
  initializePosts() {
    if (!this._posts) {
      this._posts = createExplorePosts(friends);
    }
    return this._posts;
  }

  /**
   * Initialize explore categories data
   * @returns {Array} Array of explore categories
   */
  initializeCategories() {
    if (!this._categories) {
      this._categories = exploreCategories;
    }
    return this._categories;
  }

  /**
   * Get all explore posts
   * @returns {Array} Array of explore posts
   */
  getPosts() {
    return this.initializePosts();
  }

  /**
   * Get all explore categories
   * @returns {Array} Array of explore categories
   */
  getCategories() {
    return this.initializeCategories();
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
   * Get posts by category
   * @param {string} categoryId - Category ID
   * @returns {Array} Array of posts in the category
   */
  getPostsByCategory(categoryId) {
    if (!categoryId) return this.getPosts();

    const categories = this.getCategories();
    const category = categories.find((c) => c.id === categoryId);

    if (!category) return this.getPosts();

    const posts = this.getPosts();
    return posts.filter((post) => post.category === category.name);
  }

  /**
   * Get featured posts
   * @param {number} limit - Maximum number of posts to return
   * @returns {Array} Array of featured posts
   */
  getFeaturedPosts(limit = 2) {
    const posts = this.getPosts();
    return posts.filter((post) => post.isPopular).slice(0, limit);
  }

  /**
   * Get regular posts (non-featured)
   * @returns {Array} Array of regular posts
   */
  getRegularPosts() {
    const posts = this.getPosts();
    const featuredPosts = this.getFeaturedPosts();
    const featuredIds = new Set(featuredPosts.map((p) => p.id));
    return posts.filter((post) => !featuredIds.has(post.id));
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Object|null} Category object or null if not found
   */
  getCategoryById(categoryId) {
    const categories = this.getCategories();
    return categories.find((cat) => cat.id === categoryId) || null;
  }

  /**
   * Reset repository data (useful for testing)
   */
  reset() {
    this._posts = null;
    this._categories = null;
  }
}

// Create singleton instance
const exploreRepository = new ExploreRepository();

// Export singleton instance
export default exploreRepository;

// Also export class for testing purposes
export { ExploreRepository };
