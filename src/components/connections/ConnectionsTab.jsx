// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Users, UserPlus } from "../icons";
import { useUser } from "../../context/AppContext";
import Avatar from "../common/Avatar";
import { BORDER_RADIUS } from "../../utils/constants";

const ConnectionsTab = () => {
  const {
    friends,
    suggestedUsers,
    connectionRequests,
    sendConnectionRequest,
    handleViewProfile,
  } = useUser();

  return (
    <div className="max-w-4xl mx-auto w-full px-4 pb-6 space-y-6">
      {/* Container 1: Connections (Page Header + My Connections) */}
      <div
        className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${BORDER_RADIUS.cardSmall} overflow-hidden`}
      >
        {/* Page Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <h1 className="text-[20px] font-bold text-slate-900 dark:text-white mb-1">
            Connections
          </h1>
          <p className="text-[14px] text-slate-600 dark:text-slate-400">
            Manage your network and discover new connections
          </p>
        </div>

        {/* My Connections Section Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              My Connections
            </h2>
          </div>
          <span
            className={`text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 ${BORDER_RADIUS.badge}`}
          >
            {friends.length} connections
          </span>
        </div>

        {/* Connections List */}
        {friends.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                role="button"
                tabIndex={0}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleViewProfile(friend)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleViewProfile(friend)
                }
              >
                <Avatar
                  src={friend.avatar}
                  alt={friend.name}
                  size="sm"
                  isOnline={friend.isOnline}
                  showStatus={true}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                    {friend.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {friend.profession || "Connection"}
                  </p>
                </div>
                <div className="shrink-0">
                  {friend.isOnline ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      <span
                        className={`w-1.5 h-1.5 bg-green-500 ${BORDER_RADIUS.badge}`}
                      ></span>
                      Online
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {friend.lastSeen}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              No connections yet
            </p>
          </div>
        )}
      </div>

      {/* Container 2: People You May Know */}
      <div
        className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${BORDER_RADIUS.cardSmall} overflow-hidden`}
      >
        {/* Section Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <UserPlus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            People You May Know
          </h2>
        </div>

        {/* Suggestions List */}
        {suggestedUsers.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {suggestedUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <button
                  type="button"
                  className="shrink-0 bg-transparent border-0 p-0 cursor-pointer"
                  onClick={() => handleViewProfile(user)}
                >
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className={`w-8 h-8 ${BORDER_RADIUS.avatar} object-cover`}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    className="font-medium text-sm text-slate-900 dark:text-white truncate hover:text-orange-600 dark:hover:text-orange-400 transition-colors bg-transparent border-0 p-0 text-left cursor-pointer"
                    onClick={() => handleViewProfile(user)}
                  >
                    {user.name}
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.mutualFriends} mutual connections
                  </p>
                </div>
                <motion.button
                  onClick={() => sendConnectionRequest(user.id)}
                  className={`shrink-0 px-3 py-1.5 ${BORDER_RADIUS.cardSmall} font-medium text-xs transition-all ${
                    connectionRequests.includes(user.id)
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm cursor-pointer"
                  }`}
                  whileHover={{
                    scale: connectionRequests.includes(user.id) ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: connectionRequests.includes(user.id) ? 1 : 0.98,
                  }}
                  disabled={connectionRequests.includes(user.id)}
                >
                  {connectionRequests.includes(user.id) ? "Sent" : "Connect"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <UserPlus className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              No suggestions at the moment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsTab;
