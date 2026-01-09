/**
 * useMessagesActions Hook
 * Extracts business logic for messaging operations
 * Decouples action handlers from context state management
 *
 * This hook consumes the MessagesContext to access state and setters,
 * then provides business logic methods to components.
 */

import { useCallback } from 'react';
import { useMessages } from '../context/AppContext';
import { createMessage } from '../services/messageService';
import {
  findConversationById,
  getOrCreateConversation,
  moveConversationToTop,
  addMessageToConversation,
  clearConversationMessages,
  cleanupEmptyConversations,
  removeConversation,
  hasMessages,
} from '../services/conversationService';
import { processImageFile } from '../utils/fileUtils';
import { EMPTY_CHAT_POPUP_DURATION } from '../utils/constants';

/**
 * Custom hook for messages action handlers
 * Consumes MessagesContext and provides business logic methods
 *
 * @returns {Object} Object containing all messages action handlers
 */
export const useMessagesActions = () => {
  // Access messages state and setters from context
  const {
    conversations,
    activeConversation,
    messageText,
    messageAttachments,
    setConversations,
    setActiveConversation,
    setMessageText,
    setMessageAttachments,
    setShowChatDropdown,
    setShowEmptyChatPopup,
    setPendingNavigateToMessages,
  } = useMessages();

  /**
   * Handle sending a message
   */
  const handleSendMessage = useCallback(() => {
    const currentMessageText = messageText[activeConversation] || '';
    const currentAttachments = messageAttachments[activeConversation] || [];

    if ((!currentMessageText.trim() && currentAttachments.length === 0) || !activeConversation) {
      return;
    }

    // Create and send user message
    const newMessage = createMessage({
      text: currentMessageText,
      isSent: true,
      attachments: currentAttachments,
      // For backward compatibility
      attachment: currentAttachments[0] || null,
    });

    // Update conversation with new message and move to top
    setConversations((prev) => {
      const updated = addMessageToConversation(prev, activeConversation, newMessage);
      return moveConversationToTop(updated, activeConversation);
    });

    // Clear input for current conversation
    setMessageText((prev) => ({ ...prev, [activeConversation]: '' }));
    setMessageAttachments((prev) => ({ ...prev, [activeConversation]: [] }));
  }, [
    activeConversation,
    messageText,
    messageAttachments,
    setConversations,
    setMessageText,
    setMessageAttachments,
  ]);

  /**
   * Handle clearing all chat messages in active conversation
   */
  const handleClearAllChat = useCallback(() => {
    if (!activeConversation) return;

    const currentConversation = findConversationById(conversations, activeConversation);

    if (!hasMessages(currentConversation)) {
      setShowEmptyChatPopup(true);
      setShowChatDropdown(false);
      setTimeout(() => setShowEmptyChatPopup(false), EMPTY_CHAT_POPUP_DURATION);
      return;
    }

    setConversations((prev) => clearConversationMessages(prev, activeConversation));
    setShowChatDropdown(false);
  }, [
    activeConversation,
    conversations,
    setConversations,
    setShowChatDropdown,
    setShowEmptyChatPopup,
  ]);

  /**
   * Handle attachment upload
   */
  const handleAttachmentUpload = useCallback(
    async (event) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0 || !activeConversation) return;

      const processedImages = await Promise.all(
        files.map(async (file) => {
          return await processImageFile(file);
        })
      );

      // Filter out any failed uploads (nulls)
      const validImages = processedImages.filter((img) => img !== null);

      if (validImages.length > 0) {
        setMessageAttachments((prev) => ({
          ...prev,
          [activeConversation]: [...(prev[activeConversation] || []), ...validImages],
        }));
      }

      // Reset input
      event.target.value = '';
    },
    [activeConversation, setMessageAttachments]
  );

  /**
   * Start a conversation with a user
   */
  const startConversation = useCallback(
    (user) => {
      const result = getOrCreateConversation(conversations, user);
      if (result.isNew) {
        setConversations(result.conversations);
      }
      setActiveConversation(result.conversation.id);
      // Signal that we want to navigate to messages tab
      setPendingNavigateToMessages(true);
    },
    [conversations, setConversations, setActiveConversation, setPendingNavigateToMessages]
  );

  /**
   * Clear the pending navigation flag
   */
  const clearPendingNavigation = useCallback(() => {
    setPendingNavigateToMessages(false);
  }, [setPendingNavigateToMessages]);

  /**
   * Handle back to conversation list (mobile view)
   */
  const handleBackToConversationList = useCallback(() => {
    const currentConv = findConversationById(conversations, activeConversation);
    if (currentConv && !hasMessages(currentConv)) {
      setConversations((prev) => removeConversation(prev, activeConversation));
    }
    setActiveConversation(null);
  }, [activeConversation, conversations, setConversations, setActiveConversation]);

  /**
   * Cleanup empty conversations
   */
  const cleanupEmptyConvos = useCallback(() => {
    setConversations((prev) => cleanupEmptyConversations(prev));
    setActiveConversation(null);
  }, [setConversations, setActiveConversation]);

  return {
    handleSendMessage,
    handleClearAllChat,
    handleAttachmentUpload,
    startConversation,
    clearPendingNavigation,
    handleBackToConversationList,
    cleanupEmptyConvos,
  };
};

export default useMessagesActions;
