/**
 * useMessagesActions Hook
 * Extracts business logic for messaging operations
 * Decouples action handlers from context state management
 */

import { useCallback } from "react";
import { createMessage } from "../services/messageService";
import {
  findConversationById,
  getOrCreateConversation,
  moveConversationToTop,
  addMessageToConversation,
  clearConversationMessages,
  cleanupEmptyConversations,
  removeConversation,
  hasMessages,
} from "../services/conversationService";
import { processImageFile } from "../utils/fileUtils";
import { EMPTY_CHAT_POPUP_DURATION } from "../utils/constants";

/**
 * Custom hook for messages action handlers
 * @param {Object} params - Hook parameters
 * @param {Array} params.conversations - Array of conversations
 * @param {string|null} params.activeConversation - Active conversation ID
 * @param {Object} params.messageText - Message text state object
 * @param {Object} params.messageAttachment - Message attachment state object
 * @param {Function} params.setConversations - Function to update conversations state
 * @param {Function} params.setActiveConversation - Function to update active conversation state
 * @param {Function} params.setMessageText - Function to update message text state
 * @param {Function} params.setMessageAttachment - Function to update message attachment state
 * @param {Function} params.setShowChatDropdown - Function to update show chat dropdown state
 * @param {Function} params.setShowEmptyChatPopup - Function to update show empty chat popup state
 * @param {Function} params.setPendingNavigateToMessages - Function to update pending navigation state
 * @returns {Object} Object containing all messages action handlers
 */
export const useMessagesActions = ({
  conversations,
  activeConversation,
  messageText,
  messageAttachment,
  setConversations,
  setActiveConversation,
  setMessageText,
  setMessageAttachment,
  setShowChatDropdown,
  setShowEmptyChatPopup,
  setPendingNavigateToMessages,
}) => {
  /**
   * Handle sending a message
   */
  const handleSendMessage = useCallback(() => {
    const currentMessageText = messageText[activeConversation] || "";
    const currentAttachment = messageAttachment[activeConversation] || null;

    if (
      (!currentMessageText.trim() && !currentAttachment) ||
      !activeConversation
    ) {
      return;
    }

    // Create and send user message
    const newMessage = createMessage({
      text: currentMessageText,
      isSent: true,
      attachment: currentAttachment,
    });

    // Update conversation with new message and move to top
    setConversations((prev) => {
      const updated = addMessageToConversation(
        prev,
        activeConversation,
        newMessage
      );
      return moveConversationToTop(updated, activeConversation);
    });

    // Clear input for current conversation
    setMessageText((prev) => ({ ...prev, [activeConversation]: "" }));
    setMessageAttachment((prev) => ({ ...prev, [activeConversation]: null }));
  }, [
    activeConversation,
    messageText,
    messageAttachment,
    setConversations,
    setMessageText,
    setMessageAttachment,
  ]);

  /**
   * Handle clearing all chat messages in active conversation
   */
  const handleClearAllChat = useCallback(() => {
    if (!activeConversation) return;

    const currentConversation = findConversationById(
      conversations,
      activeConversation
    );

    if (!hasMessages(currentConversation)) {
      setShowEmptyChatPopup(true);
      setShowChatDropdown(false);
      setTimeout(() => setShowEmptyChatPopup(false), EMPTY_CHAT_POPUP_DURATION);
      return;
    }

    setConversations((prev) =>
      clearConversationMessages(prev, activeConversation)
    );
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
      const file = event.target.files?.[0];
      if (!file || !activeConversation) return;

      const dataUrl = await processImageFile(file);
      if (dataUrl) {
        setMessageAttachment((prev) => ({
          ...prev,
          [activeConversation]: dataUrl,
        }));
      }
    },
    [activeConversation, setMessageAttachment]
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
