import { useRef, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "../../context/AppContext";
import { BORDER_RADIUS } from "../../utils/constants";
import ConversationsList from "./chat/ConversationsList";
import ActiveChat from "./chat/ActiveChat";
import EmptyChatState from "./chat/EmptyChatState";

const MessagesTab = () => {
  // Access messages state and actions directly from context
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    setConversations,
    messageText,
    setMessageText,
    messageAttachment,
    setMessageAttachment,
    showChatDropdown,
    setShowChatDropdown,
    showEmptyChatPopup,
    handleSendMessage,
    handleClearAllChat,
    handleAttachmentUpload,
    handleBackToConversationList,
  } = useMessages();

  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeConversation && conversations.length > 0) {
      scrollToBottom();
    }
  }, [conversations, activeConversation]);

  const filteredConversations = searchQuery.trim()
    ? conversations.filter(
      (conversation) =>
        conversation.user.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
    : conversations;

  const activeConversationData = conversations.find(
    (conv) => conv.id === activeConversation,
  );

  const handleBackToList = () => {
    handleBackToConversationList();
  };

  // Get current message text and attachment for active conversation
  const currentMessageText = activeConversation
    ? messageText[activeConversation] || ""
    : "";
  const currentMessageAttachment = activeConversation
    ? messageAttachment[activeConversation] || null
    : null;

  // Handle setting message text for current conversation
  const handleSetMessageText = (value) => {
    if (activeConversation) {
      setMessageText((prev) => ({
        ...prev,
        [activeConversation]: value,
      }));
    }
  };

  // Handle setting message attachment for current conversation
  const handleSetMessageAttachment = (value) => {
    if (activeConversation) {
      setMessageAttachment((prev) => ({
        ...prev,
        [activeConversation]: value,
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full overflow-x-hidden px-0">
      <div
        className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl shadow-xs border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-6rem)] lg:h-[calc(100vh-7rem)] transition-colors duration-200"
      >
        <div className="flex h-full min-h-0">
          {/* Conversations List */}
          <ConversationsList
            conversations={conversations}
            filteredConversations={filteredConversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            setConversations={setConversations}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isHidden={!!activeConversation}
          />

          {/* Active Conversation */}
          <div
            className={`flex-1 flex flex-col ${activeConversation ? "flex" : "hidden sm:flex"}`}
          >
            {activeConversationData ? (
              <ActiveChat
                conversation={activeConversationData}
                onBack={handleBackToList}
                showChatDropdown={showChatDropdown}
                setShowChatDropdown={setShowChatDropdown}
                onClearAllChat={handleClearAllChat}
                messageText={currentMessageText}
                setMessageText={handleSetMessageText}
                messageAttachment={currentMessageAttachment}
                setMessageAttachment={handleSetMessageAttachment}
                onSendMessage={handleSendMessage}
                onAttachmentUpload={handleAttachmentUpload}
                messagesEndRef={messagesEndRef}
              />
            ) : (
              <EmptyChatState />
            )}
          </div>
        </div>
      </div>

      {/* Empty Chat Popup */}
      <AnimatePresence>
        {showEmptyChatPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 ${BORDER_RADIUS.card} shadow-2xl z-50 text-sm sm:text-base whitespace-nowrap`}
          >
            Chat is already empty
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesTab;
