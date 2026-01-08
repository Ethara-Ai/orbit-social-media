/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";

// Import Data
import { friends, createInitialConversations } from "../../data/mockData";

// Import Services
import {
  generateSmartResponse,
  createMessage,
} from "../../services/messageService";
import {
  findConversationById,
  getOrCreateConversation,
  moveConversationToTop,
  addMessageToConversation,
  clearConversationMessages,
  cleanupEmptyConversations,
  removeConversation,
  getTotalUnreadCount,
  hasMessages,
} from "../../services/conversationService";

// Import Utils
import { processImageFile } from "../../utils/helpers";
import {
  SMART_RESPONSE_DELAY,
  EMPTY_CHAT_POPUP_DURATION,
} from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const MessagesContext = createContext(null);

// ============================================================================
// Messages Provider
// Self-contained provider managing messages-related state and actions
// ============================================================================

export function MessagesProvider({ children }) {
  // ==========================================================================
  // Initialize Mock Data
  // ==========================================================================
  const initialConversations = useMemo(
    () => createInitialConversations(friends),
    [],
  );

  // ==========================================================================
  // Messages State
  // ==========================================================================
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState({});
  const [messageAttachment, setMessageAttachment] = useState({});
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showEmptyChatPopup, setShowEmptyChatPopup] = useState(false);
  const [pendingNavigateToMessages, setPendingNavigateToMessages] =
    useState(false);
  const activeConversationRef = useRef(activeConversation);

  // Keep ref in sync with state for async operations
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Click outside handler for chat dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showChatDropdown &&
        !event.target.closest(".chat-dropdown-container")
      ) {
        setShowChatDropdown(false);
      }
    };

    if (showChatDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatDropdown]);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const totalUnreadMessages = useMemo(
    () => getTotalUnreadCount(conversations),
    [conversations],
  );

  // ==========================================================================
  // Messages Handlers
  // ==========================================================================

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
        newMessage,
      );
      return moveConversationToTop(updated, activeConversation);
    });

    // Clear input for current conversation
    setMessageText((prev) => ({ ...prev, [activeConversation]: "" }));
    setMessageAttachment((prev) => ({ ...prev, [activeConversation]: null }));
  }, [activeConversation, messageText, messageAttachment]);

  const handleClearAllChat = useCallback(() => {
    if (!activeConversation) return;

    const currentConversation = findConversationById(
      conversations,
      activeConversation,
    );

    if (!hasMessages(currentConversation)) {
      setShowEmptyChatPopup(true);
      setShowChatDropdown(false);
      setTimeout(() => setShowEmptyChatPopup(false), EMPTY_CHAT_POPUP_DURATION);
      return;
    }

    setConversations((prev) =>
      clearConversationMessages(prev, activeConversation),
    );
    setShowChatDropdown(false);
  }, [activeConversation, conversations]);

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
    [activeConversation],
  );

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
    [conversations],
  );

  // Clear the pending navigation flag (called by consuming components)
  const clearPendingNavigation = useCallback(() => {
    setPendingNavigateToMessages(false);
  }, []);

  const handleBackToConversationList = useCallback(() => {
    const currentConv = findConversationById(conversations, activeConversation);
    if (currentConv && !hasMessages(currentConv)) {
      setConversations((prev) => removeConversation(prev, activeConversation));
    }
    setActiveConversation(null);
  }, [activeConversation, conversations]);

  // Cleanup empty conversations (called when leaving messages tab)
  const cleanupEmptyConvos = useCallback(() => {
    setConversations((prev) => cleanupEmptyConversations(prev));
    setActiveConversation(null);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      conversations,
      activeConversation,
      messageText,
      messageAttachment,
      showChatDropdown,
      showEmptyChatPopup,
      totalUnreadMessages,
      pendingNavigateToMessages,
      // Setters
      setActiveConversation,
      setConversations,
      setMessageText,
      setMessageAttachment,
      setShowChatDropdown,
      setShowEmptyChatPopup,
      // Actions
      handleSendMessage,
      handleClearAllChat,
      handleAttachmentUpload,
      startConversation,
      handleBackToConversationList,
      cleanupEmptyConvos,
      clearPendingNavigation,
    }),
    [
      conversations,
      activeConversation,
      messageText,
      messageAttachment,
      showChatDropdown,
      showEmptyChatPopup,
      totalUnreadMessages,
      pendingNavigateToMessages,
      handleSendMessage,
      handleClearAllChat,
      handleAttachmentUpload,
      startConversation,
      handleBackToConversationList,
      cleanupEmptyConvos,
      clearPendingNavigation,
    ],
  );

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}

export default MessagesContext;
