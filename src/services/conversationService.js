/**
 * Conversation Service
 * Handles conversation-related business logic to avoid duplication
 */

/**
 * Create a new conversation object
 * @param {Object} user - User object for the conversation
 * @returns {Object} New conversation object
 */
export const createConversation = (user) => {
  return {
    id: `conv-${user.id}-${Date.now()}`,
    user,
    messages: [],
    unreadCount: 0,
    lastMessage: "",
    lastMessageTime: "",
  };
};

/**
 * Find an existing conversation with a user
 * @param {Object[]} conversations - List of conversations
 * @param {string} userId - User ID to find
 * @returns {Object|undefined} Found conversation or undefined
 */
export const findConversationByUserId = (conversations, userId) => {
  return conversations.find((c) => c.user.id === userId);
};

/**
 * Find a conversation by its ID
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - Conversation ID to find
 * @returns {Object|undefined} Found conversation or undefined
 */
export const findConversationById = (conversations, conversationId) => {
  return conversations.find((c) => c.id === conversationId);
};

/**
 * Get or create a conversation with a user
 * @param {Object[]} conversations - Current list of conversations
 * @param {Object} user - User to start conversation with
 * @returns {{ conversation: Object, conversations: Object[], isNew: boolean }} Result object
 */
export const getOrCreateConversation = (conversations, user) => {
  const existingConv = findConversationByUserId(conversations, user.id);

  if (existingConv) {
    return {
      conversation: existingConv,
      conversations,
      isNew: false,
    };
  }

  const newConversation = createConversation(user);
  return {
    conversation: newConversation,
    conversations: [newConversation, ...conversations],
    isNew: true,
  };
};

/**
 * Move a conversation to the top of the list
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to move to top
 * @returns {Object[]} Reordered conversations
 */
export const moveConversationToTop = (conversations, conversationId) => {
  const targetConv = conversations.find((c) => c.id === conversationId);
  if (!targetConv) return conversations;

  const otherConvs = conversations.filter((c) => c.id !== conversationId);
  return [targetConv, ...otherConvs];
};

/**
 * Update a conversation with new data
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to update
 * @param {Object} updates - Updates to apply
 * @returns {Object[]} Updated conversations
 */
export const updateConversation = (conversations, conversationId, updates) => {
  return conversations.map((conv) =>
    conv.id === conversationId ? { ...conv, ...updates } : conv
  );
};

/**
 * Add a message to a conversation
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to add message to
 * @param {Object} message - Message to add
 * @param {boolean} isViewing - Whether user is currently viewing the conversation
 * @returns {Object[]} Updated conversations
 */
export const addMessageToConversation = (
  conversations,
  conversationId,
  message,
  isViewing = true
) => {
  return conversations.map((conv) => {
    if (conv.id !== conversationId) return conv;

    return {
      ...conv,
      messages: [...conv.messages, message],
      lastMessage: message.text || "Sent an attachment",
      lastMessageTime: "Just now",
      unreadCount:
        message.isSent || isViewing ? conv.unreadCount : conv.unreadCount + 1,
    };
  });
};

/**
 * Clear all messages from a conversation
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to clear
 * @returns {Object[]} Updated conversations
 */
export const clearConversationMessages = (conversations, conversationId) => {
  return conversations.map((conv) =>
    conv.id === conversationId
      ? {
          ...conv,
          messages: [],
          lastMessage: "No messages yet",
          lastMessageTime: "",
          unreadCount: 0,
        }
      : conv
  );
};

/**
 * Remove empty conversations from the list
 * @param {Object[]} conversations - List of conversations
 * @returns {Object[]} Filtered conversations
 */
export const cleanupEmptyConversations = (conversations) => {
  return conversations.filter((conv) => conv.messages.length > 0);
};

/**
 * Remove a specific conversation
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to remove
 * @returns {Object[]} Updated conversations
 */
export const removeConversation = (conversations, conversationId) => {
  return conversations.filter((conv) => conv.id !== conversationId);
};

/**
 * Filter conversations by search query
 * @param {Object[]} conversations - List of conversations
 * @param {string} query - Search query
 * @returns {Object[]} Filtered conversations
 */
export const filterConversations = (conversations, query) => {
  if (!query.trim()) return conversations;

  const lowerQuery = query.toLowerCase();
  return conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(lowerQuery) ||
      conversation.lastMessage.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get total unread message count across all conversations
 * @param {Object[]} conversations - List of conversations
 * @returns {number} Total unread count
 */
export const getTotalUnreadCount = (conversations) => {
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
};

/**
 * Check if a conversation has messages
 * @param {Object} conversation - Conversation to check
 * @returns {boolean} Whether conversation has messages
 */
export const hasMessages = (conversation) => {
  return conversation?.messages?.length > 0;
};

/**
 * Mark all messages in a conversation as read
 * @param {Object[]} conversations - List of conversations
 * @param {string} conversationId - ID of conversation to mark as read
 * @returns {Object[]} Updated conversations
 */
export const markConversationAsRead = (conversations, conversationId) => {
  return conversations.map((conv) =>
    conv.id === conversationId
      ? {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map((msg) => ({ ...msg, isRead: true })),
        }
      : conv
  );
};

export default {
  createConversation,
  findConversationByUserId,
  findConversationById,
  getOrCreateConversation,
  moveConversationToTop,
  updateConversation,
  addMessageToConversation,
  clearConversationMessages,
  cleanupEmptyConversations,
  removeConversation,
  filterConversations,
  getTotalUnreadCount,
  hasMessages,
  markConversationAsRead,
};
