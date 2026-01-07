// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SuggestedUsersSection = ({
  suggestedUsers,
  connectionRequests,
  sendConnectionRequest,
  handleViewProfile,
}) => {
  return (
    <>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-8 mb-4 transition-colors">
        People You May Know
      </h2>
      <div className="space-y-3">
        {suggestedUsers.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index + 5) * 0.1 }}
            onClick={() => handleViewProfile(user)}
          >
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm truncate transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
                {user.mutualFriends} mutual connections
              </p>
            </div>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                sendConnectionRequest(user.id);
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                connectionRequests.includes(user.id)
                  ? "text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 cursor-default"
                  : "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20"
              }`}
              whileHover={{
                scale: connectionRequests.includes(user.id) ? 1 : 1.05,
              }}
              whileTap={{
                scale: connectionRequests.includes(user.id) ? 1 : 0.95,
              }}
              disabled={connectionRequests.includes(user.id)}
            >
              {connectionRequests.includes(user.id)
                ? "Request Sent"
                : "Connect"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SuggestedUsersSection;
