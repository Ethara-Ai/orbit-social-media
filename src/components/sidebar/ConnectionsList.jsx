// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronDown } from "../icons";
import Avatar from "../common/Avatar";
import { BORDER_RADIUS } from "../../utils/constants";

const ConnectionsList = ({
  friends,
  showFriends,
  setShowFriends,
  onFriendClick,
}) => {
  return (
    <div className="border-t border-slate-100 dark:border-slate-700 pt-4 transition-colors">
      <ConnectionsHeader
        friendsCount={friends.length}
        showFriends={showFriends}
        setShowFriends={setShowFriends}
      />

      <AnimatePresence>
        {showFriends && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 py-1.5 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar">
              {friends.map((friend, index) => (
                <ConnectionItem
                  key={friend.id}
                  friend={friend}
                  index={index}
                  onClick={onFriendClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ConnectionsHeader = ({ friendsCount, showFriends, setShowFriends }) => {
  return (
    <motion.button
      onClick={() => setShowFriends(!showFriends)}
      className={`w-full flex items-center justify-between px-4 py-3 ${BORDER_RADIUS.card} hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <span className="font-medium text-sm text-slate-700 dark:text-slate-300 transition-colors">
          Connections
        </span>
        <span className={`text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 ${BORDER_RADIUS.badge} transition-colors`}>
          {friendsCount}
        </span>
      </div>
      <motion.div
        animate={{ rotate: showFriends ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </motion.div>
    </motion.button>
  );
};

const ConnectionItem = ({ friend, index, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(friend);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      className={`flex items-center gap-2 p-1.5 ${BORDER_RADIUS.cardSmall} hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer mx-2`}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <Avatar
        src={friend.avatar}
        alt={friend.name}
        size="sm"
        isOnline={friend.isOnline}
        showStatus={true}
        className="w-7 h-7"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white truncate text-xs transition-colors">
          {friend.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
          {friend.isOnline ? "Online" : friend.lastSeen}
        </p>
      </div>
    </motion.div>
  );
};

export default ConnectionsList;
