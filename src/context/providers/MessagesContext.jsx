/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";

// Import Data
import { conversationRepository } from "../../data/repositories";

// Import Services
import { getTotalUnreadCount } from "../../services/conversationService";

// Import Hooks
import { useMessagesActions } from "../../hooks/useMessagesActions";

// ============================================================================
// Context Definition
// ============================================================================

const MessagesContext = createContext(null);

// ============================================================================
// Messages Provider
// Self-contained provider managing messages-related state
// Business logic extracted to useMessagesActions hook
//
// Encapsulation Strategy:
// - Messaging interface setters (setActiveConversation, setConversations,
//   setMessageText, setMessageAttachment, setShowChatDropdown) are exposed
//   to support the complex messaging UI interaction patterns
// - Internal UI setters (setShowEmptyChatPopup, setPendingNavigateToMessages)
//   are kept internal and only accessible through actions
// ============================================================================

export function MessagesProvider({ children }) {
  // ==========================================================================
  // Initialize Data from Repository
  // ==========================================================================
  const initialConversations = useMemo(
    () => conversationRepository.getConversations(),
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
  // Messages Action Handlers (Business Logic)
  // ==========================================================================
  const {
    handleSendMessage,
    handleClearAllChat,
    handleAttachmentUpload,
    startConversation,
    clearPendingNavigation,
    handleBackToConversationList,
    cleanupEmptyConvos,
  } = useMessagesActions({
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
  });

  // ==========================================================================
  // Context Value
  //
  // Exposed to consumers:
  // - Read-only data (conversations, messageText, etc.)
  // - Messaging interface setters (for conversation/message state management)
  // - Actions (encapsulated business logic operations)
  //
  // Kept internal (not exposed):
  // - setShowEmptyChatPopup (managed by actions)
  // - setPendingNavigateToMessages (managed by actions)
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      conversations,
      activeConversation,
      messageText,
      messageAttachment,
      showChatDropdown,
      showEmptyChatPopup,
      totalUnreadMessages,
      pendingNavigateToMessages,
      // Messaging Interface Setters (for complex UI state management)
      setActiveConversation,
      setConversations,
      setMessageText,
      setMessageAttachment,
      setShowChatDropdown,
      // Actions (encapsulate complex operations)
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
