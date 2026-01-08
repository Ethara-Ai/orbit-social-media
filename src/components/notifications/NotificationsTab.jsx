// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, User, Bell, Users } from "../icons";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import { useNotifications, useUser } from "../../context/AppContext";

const NotificationsTab = () => {
  // Access notifications state directly from context
  const { notifications, setNotifications } = useNotifications();

  // Access user actions from context
  const { handleViewProfile } = useUser();

  // Mark a single notification as read
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n,
        ),
      );
    }
    if (handleViewProfile) {
      handleViewProfile(notification.user);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <NotificationsHeader />

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
              onClick={() => handleNotificationClick(notification)}
            />
          ))
        ) : (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="When there's any update in your orbit, it'll show up here"
          />
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <NotificationsFooter count={notifications.length} />
      )}
    </div>
  );
};

const NotificationsHeader = () => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
        Notifications
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">
        Stay updated with your latest interactions
      </p>
    </div>
  );
};

const NotificationItem = ({ notification, index, onClick }) => {
  const isUnread = !notification.isRead;

  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xs border cursor-pointer transition-all duration-300 ${isUnread
          ? "border-orange-200 dark:border-orange-500/30 bg-orange-50/30 dark:bg-orange-500/10"
          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
        }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 2 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Avatar with Icon Badge */}
        <NotificationAvatar user={notification.user} type={notification.type} />

        {/* Content */}
        <NotificationContent notification={notification} isUnread={isUnread} />
      </div>
    </motion.div>
  );
};

const NotificationAvatar = ({ user, type }) => {
  return (
    <div className="relative shrink-0">
      <Avatar src={user.avatar} alt={user.name} size="xl" />
      <NotificationIconBadge type={type} />
    </div>
  );
};

const NotificationIconBadge = ({ type }) => {
  const { icon, bgClass } = getNotificationIconConfig(type);

  return (
    <div
      className={`absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-xs ${bgClass}`}
    >
      {icon}
    </div>
  );
};

const NotificationContent = ({ notification, isUnread }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900 dark:text-white text-sm transition-colors">
          {notification.user.name}
        </span>
        {isUnread && <UnreadDot />}
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm transition-colors">
        {notification.message}
      </p>
      <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 transition-colors">
        {notification.timestamp}
      </p>
    </div>
  );
};

const UnreadDot = () => {
  return <span className="w-2 h-2 bg-orange-500 rounded-full" />;
};

const NotificationsFooter = ({ count }) => {
  return (
    <motion.div
      className="mt-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <p className="text-slate-400 dark:text-slate-500 text-sm transition-colors">
        Showing {count} notification{count !== 1 ? "s" : ""}
      </p>
    </motion.div>
  );
};

// Helper function to get notification icon configuration
const getNotificationIconConfig = (type) => {
  const configs = {
    like: {
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      bgClass: "bg-rose-50 dark:bg-rose-500/20",
    },
    comment: {
      icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
      bgClass: "bg-blue-50 dark:bg-blue-500/20",
    },
    follow: {
      icon: <UserPlus className="w-4 h-4 text-emerald-500" />,
      bgClass: "bg-emerald-50 dark:bg-emerald-500/20",
    },
    mention: {
      icon: <User className="w-4 h-4 text-orange-500" />,
      bgClass: "bg-orange-50 dark:bg-orange-500/20",
    },
    friend_request: {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      bgClass: "bg-purple-50 dark:bg-purple-500/20",
    },
  };

  return (
    configs[type] || {
      icon: <Bell className="w-4 h-4 text-slate-400" />,
      bgClass: "bg-slate-50 dark:bg-slate-700",
    }
  );
};

export default NotificationsTab;
