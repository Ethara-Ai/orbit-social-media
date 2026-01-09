/**
 * Conversation Repository
 * Manages conversation data initialization and access
 * Decouples data layer from state management
 */

import { createInitialConversations, friends } from "../mockData";

/**
 * ConversationRepository Class
 * Singleton pattern for managing conversation-related data
 */
class ConversationRepository {
  constructor() {
    this._conversations = null;
  }

  /**
   * Initialize conversations data
   * @returns {Array} Array of conversations
   */
  initializeConversations() {
    if (!this._conversations) {
      this._conversations = createInitialConversations(friends);
    }
    return this._conversations;
  }

  /**
   * Get all conversations
   * @returns {Array} Array of conversations
   */
  getConversations() {
    return this.initializeConversations();
  }

  /**
   * Get conversation by ID
   * @param {string} conversationId - Conversation ID
   * @returns {Object|null} Conversation object or null if not found
   */
  getConversationById(conversationId) {
    const conversations = this.getConversations();
    return conversations.find((conv) => conv.id === conversationId) || null;
  }

  /**
   * Get conversation by user ID
   * @param {string} userId - User ID
   * @returns {Object|null} Conversation object or null if not found
   */
  getConversationByUserId(userId) {
    const conversations = this.getConversations();
    return conversations.find((conv) => conv.user.id === userId) || null;
  }

  /**
   * Get total unread count across all conversations
   * @returns {number} Total unread count
   */
  getTotalUnreadCount() {
    const conversations = this.getConversations();
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }

  /**
   * Reset repository data (useful for testing)
   */
  reset() {
    this._conversations = null;
  }
}

// Create singleton instance
const conversationRepository = new ConversationRepository();

// Export singleton instance
export default conversationRepository;

// Also export class for testing purposes
export { ConversationRepository };
