// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../../common/Avatar';
import { MoreHorizontal, X } from '../../icons';
import { BORDER_RADIUS } from '../../../utils/constants';

const ChatHeader = ({ conversation, onBack, showDropdown, setShowDropdown, onClearChat }) => {
  return (
    <div className="p-2 sm:p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 sm:gap-3 bg-white dark:bg-slate-900 transition-colors">
      {/* Back Button (Mobile) */}
      <motion.button
        onClick={onBack}
        className={`sm:hidden p-1.5 sm:p-2 ${BORDER_RADIUS.cardSmall} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer`}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* User Info */}
      <Avatar
        src={conversation.user.avatar}
        alt={conversation.user.name}
        size="md"
        isOnline={conversation.user.isOnline}
        showStatus={true}
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate transition-colors">
          {conversation.user.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
          {conversation.user.isOnline ? 'Online' : conversation.user.lastSeen}
        </p>
      </div>

      {/* Dropdown Menu */}
      <div className="relative chat-dropdown-container shrink-0">
        <motion.button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`p-1.5 sm:p-2 ${BORDER_RADIUS.cardSmall} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer`}
          whileTap={{ scale: 0.95 }}
        >
          <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400" />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className={`absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 ${BORDER_RADIUS.dropdown} shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 min-w-35 transition-colors`}
            >
              <button
                onClick={onClearChat}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Clear chat</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatHeader;
