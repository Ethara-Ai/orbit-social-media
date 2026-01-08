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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map((friend, index) => (
                        <motion.div
                            key={friend.id}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleViewProfile(friend)}
                        >
                            <div className="flex flex-col items-center text-center">
                                <Avatar
                                    src={friend.avatar}
                                    alt={friend.name}
                                    size="xl"
                                    isOnline={friend.isOnline}
                                    showStatus={true}
                                    className="mb-4"
                                />
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                    {friend.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {friend.profession || "Connection"}
                                </p>
                                {friend.isOnline ? (
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-lg transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (friends.length * 0.05) + (index * 0.05) }}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className="cursor-pointer mb-4"
                                    onClick={() => handleViewProfile(user)}
                                >
                                    <img
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.name}
                                        className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-700"
                                    />
                                </div>
                                <h3
                                    className="font-semibold text-slate-900 dark:text-white mb-1 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                    onClick={() => handleViewProfile(user)}
                                >
                                    {user.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    {user.mutualFriends} mutual connections
                                </p>
                                <motion.button
                                    onClick={() => sendConnectionRequest(user.id)}
                                    className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${connectionRequests.includes(user.id)
                                            ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-default"
                                            : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25"
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
                                        ? "Request Sent"
                                        : "Connect"}
                                </motion.button>
                            </div>
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
