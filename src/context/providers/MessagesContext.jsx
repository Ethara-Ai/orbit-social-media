/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';

// Import Data
import { conversationRepository } from '../../data/repositories';

// Import Services
import { getTotalUnreadCount } from '../../services/conversationService';

// ============================================================================
// Context Definition
// ============================================================================

const MessagesContext = createContext(null);
MessagesContext.displayName = 'MessagesContext';

// ============================================================================
// Messages Provider
// Pure state management provider - no business logic
//
// Responsibilities:
// - Initialize and manage messages state (conversations, active conversation, etc.)
// - Expose state and setters for components and action hooks
// - Keep business logic in separate action hooks (useMessagesActions)
//
// Design Principle:
// This provider follows the principle of separation of concerns by managing
// ONLY state. Business logic is delegated to action hooks that consume this
// context and provide methods to components.
// ============================================================================

export function MessagesProvider({ children }) {
  // ==========================================================================
  // Initialize Data from Repository
  // ==========================================================================
  const initialConversations = useMemo(() => conversationRepository.getConversations(), []);

  // ==========================================================================
  // Messages State
  // ==========================================================================
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageText, setMessageText] = useState({});
  const [messageAttachments, setMessageAttachments] = useState({});
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showEmptyChatPopup, setShowEmptyChatPopup] = useState(false);
  const [pendingNavigateToMessages, setPendingNavigateToMessages] = useState(false);
  const activeConversationRef = useRef(activeConversation);

  // Keep ref in sync with state for async operations
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // Click outside handler for chat dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChatDropdown && !event.target.closest('.chat-dropdown-container')) {
        setShowChatDropdown(false);
      }
    };

    if (showChatDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChatDropdown]);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const totalUnreadMessages = useMemo(() => getTotalUnreadCount(conversations), [conversations]);

  // ==========================================================================
  // Context Value
  //
  // Exposes:
  // - Read-only data (conversations, messageText, etc.)
  // - All state setters for maximum flexibility
  //
  // Business logic is NOT included here - components should use
  // useMessagesActions hook which consumes this context
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      conversations,
      activeConversation,
      activeConversationRef,
      messageText,
      activeConversationRef,
      messageText,
      messageAttachments,
      showChatDropdown,
      showEmptyChatPopup,
      totalUnreadMessages,
      pendingNavigateToMessages,

      // State Setters
      setConversations,
      setActiveConversation,
      setMessageText,
      setMessageAttachments,
      setShowChatDropdown,
      setShowEmptyChatPopup,
      setPendingNavigateToMessages,
    }),
    [
      conversations,
      activeConversation,
      messageText,
      messageAttachments,
      showChatDropdown,
      showEmptyChatPopup,
      totalUnreadMessages,
      pendingNavigateToMessages,
    ]
  );

  return <MessagesContext.Provider value={contextValue}>{children}</MessagesContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}

export default MessagesContext;
