import { memo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search } from '../../icons';
import Avatar from '../../common/Avatar';
import { BORDER_RADIUS } from '../../../utils/constants';

const ConversationsList = ({
  conversations,
  filteredConversations,
  activeConversation,
  setActiveConversation,
  setConversations,
  searchQuery,
  setSearchQuery,
  isHidden = false,
}) => {
  const handleConversationClick = (conversation) => {
    // If clicking on a different conversation, check if current one is empty and remove it
    if (activeConversation && activeConversation !== conversation.id) {
      const currentConv = conversations.find((c) => c.id === activeConversation);
      if (currentConv && currentConv.messages.length === 0) {
        setConversations((prevConversations) =>
          prevConversations.filter((conv) => conv.id !== activeConversation)
        );
      }
    }

    setActiveConversation(conversation.id);
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  return (
    <div
      className={`w-full sm:w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col max-w-[100vw] overflow-x-hidden transition-colors ${
        isHidden ? 'hidden sm:flex' : 'flex'
      }`}
    >
      {/* Header */}
      <ConversationsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length > 0
          ? filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation === conversation.id}
                onClick={() => handleConversationClick(conversation)}
              />
            ))
          : searchQuery.trim() && <EmptySearchState />}
      </div>
    </div>
  );
};

const ConversationsHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 transition-colors">
        Chats
      </h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-3 sm:pr-4 bg-slate-100 dark:bg-slate-800 border-0 ${BORDER_RADIUS.input} text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-700 transition-all`}
        />
        <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
      </div>
    </div>
  );
};

const ConversationItem = memo(function ConversationItem({ conversation, isActive, onClick }) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-all border-b border-slate-50 dark:border-slate-800 ${
        isActive
          ? 'bg-orange-50 dark:bg-orange-500/10'
          : hasUnread
            ? 'bg-orange-50/40 dark:bg-orange-500/5 hover:bg-orange-50/60 dark:hover:bg-orange-500/10'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
      whileHover={{ x: 2 }}
    >
      <Avatar
        src={conversation.user.avatar}
        alt={conversation.user.name}
        size="lg"
        isOnline={conversation.user.isOnline}
        showStatus={true}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3
            className={`text-sm truncate transition-colors ${
              hasUnread
                ? 'font-bold text-slate-900 dark:text-white'
                : 'font-semibold text-slate-900 dark:text-white'
            }`}
          >
            {conversation.user.name}
          </h3>
          <span
            className={`text-xs shrink-0 transition-colors ${
              hasUnread
                ? 'text-orange-600 dark:text-orange-400 font-semibold'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {conversation.lastMessageTime}
          </span>
        </div>
        <p
          className={`text-xs truncate transition-colors ${
            hasUnread
              ? 'text-slate-800 dark:text-slate-200 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {conversation.lastMessage}
        </p>
      </div>
      {hasUnread && <UnreadBadge count={conversation.unreadCount} />}
    </motion.div>
  );
});

const UnreadBadge = ({ count }) => {
  return (
    <div
      className={`bg-orange-500 text-white text-xs ${BORDER_RADIUS.badge} min-w-5 h-5 flex items-center justify-center shrink-0 font-bold px-1.5`}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
};

const EmptySearchState = () => {
  return (
    <div className="text-center py-8 sm:py-12 px-4">
      <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2 sm:mb-3" />
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm transition-colors">
        No chats found
      </p>
    </div>
  );
};

export default ConversationsList;
export { ConversationsHeader, ConversationItem, UnreadBadge, EmptySearchState };
