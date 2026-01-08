// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const MessageIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const ActiveNowSection = ({
  activeOnlineFriends,
  friends,
  startConversation,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white transition-colors">
          Active Now
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full transition-colors">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          {activeOnlineFriends.length} online
        </span>
      </div>
      <div className="space-y-1.5">
        {activeOnlineFriends.map((friend, index) => (
          <motion.div
            key={friend.id}
            className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: -2 }}
            onClick={() => startConversation(friend)}
          >
            <div className="relative">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-xs truncate transition-colors">
                {friend.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate transition-colors">
                {friend.profession}
              </p>
            </div>
            <motion.button
              className="text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors p-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                startConversation(friend);
              }}
            >
              <MessageIcon />
            </motion.button>
          </motion.div>
        ))}
        {friends.filter((f) => f.isOnline).length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4 transition-colors">
            No connections online
          </p>
        )}
      </div>
    </>
  );
};

export default ActiveNowSection;
