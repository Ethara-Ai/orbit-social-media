// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Users, UserPlus } from "../icons";
import { useUser } from "../../context/AppContext";
import Avatar from "../common/Avatar";

const ConnectionsTab = () => {
    const {
        friends,
        suggestedUsers,
        connectionRequests,
        sendConnectionRequest,
        handleViewProfile,
    } = useUser();

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    Connections
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your network and discover new connections
                </p>
            </div>

            {/* My Connections Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            My Connections
                        </h2>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        {friends.length} connections
                    </span>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
                    {friends.map((friend, index) => (
                        <motion.div
                            key={friend.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleViewProfile(friend)}
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
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
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

                {friends.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-600 dark:text-slate-400">
                            No connections yet
                        </p>
                    </div>
                )}
            </div>

            {/* People You May Know Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <UserPlus className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        People You May Know
                    </h2>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-100 dark:divide-slate-700">
                    {suggestedUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <div
                                className="cursor-pointer shrink-0"
                                onClick={() => handleViewProfile(user)}
                            >
                                <img
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3
                                    className="font-medium text-sm text-slate-900 dark:text-white truncate cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                    onClick={() => handleViewProfile(user)}
                                >
                                    {user.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user.mutualFriends} mutual connections
                                </p>
                            </div>
                            <motion.button
                                onClick={() => sendConnectionRequest(user.id)}
                                className={`shrink-0 px-3 py-1.5 rounded-md font-medium text-xs transition-all ${connectionRequests.includes(user.id)
                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default"
                                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                                    }`}
                                whileHover={{
                                    scale: connectionRequests.includes(user.id) ? 1 : 1.02,
                                }}
                                whileTap={{
                                    scale: connectionRequests.includes(user.id) ? 1 : 0.98,
                                }}
                                disabled={connectionRequests.includes(user.id)}
                            >
                                {connectionRequests.includes(user.id)
                                    ? "Sent"
                                    : "Connect"}
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {suggestedUsers.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
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
