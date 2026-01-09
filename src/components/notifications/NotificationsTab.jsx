/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';
// eslint-disable-next-line no-unused-vars
<<<<<<< HEAD
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, User, Bell, Users } from "../icons";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import { useNotifications } from "../../context/AppContext";
import { BORDER_RADIUS } from "../../utils/constants";
=======
import { motion } from 'framer-motion';
import { Heart, MessageCircle, UserPlus, User, Bell, Users } from '../icons';
import Avatar from '../common/Avatar';
import EmptyState from '../common/EmptyState';
import { useNotifications } from '../../context/AppContext';
>>>>>>> c54d32b27c727901701da85adb2ed9bf2b8c9945

const NotificationsTab = () => {
  // Access notifications state directly from context
  const { notifications } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <NotificationsHeader />

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationItem key={notification.id} notification={notification} index={index} />
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
      {notifications.length > 0 && <NotificationsFooter count={notifications.length} />}
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

const NotificationItem = memo(function NotificationItem({ notification, index }) {
  const isUnread = !notification.isRead;

  return (
    <motion.div
<<<<<<< HEAD
      className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} p-4 shadow-xs border cursor-default transition-all duration-300 ${isUnread
        ? "border-orange-200 dark:border-orange-500/30 bg-orange-50/30 dark:bg-orange-500/10"
        : "border-slate-200 dark:border-slate-700"
        }`}
=======
      className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-xs border cursor-default transition-all duration-300 ${
        isUnread
          ? 'border-orange-200 dark:border-orange-500/30 bg-orange-50/30 dark:bg-orange-500/10'
          : 'border-slate-200 dark:border-slate-700'
      }`}
>>>>>>> c54d32b27c727901701da85adb2ed9bf2b8c9945
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar with Icon Badge */}
        <NotificationAvatar user={notification.user} type={notification.type} />

        {/* Content */}
        <NotificationContent notification={notification} isUnread={isUnread} />
      </div>
    </motion.div>
  );
});

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
<<<<<<< HEAD
    <div
      className={`absolute -bottom-0.5 -right-0.5 ${BORDER_RADIUS.badge} p-1 shadow-xs ${bgClass}`}
    >
=======
    <div className={`absolute -bottom-1 -right-1 rounded-full p-1.5 shadow-xs ${bgClass}`}>
>>>>>>> c54d32b27c727901701da85adb2ed9bf2b8c9945
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
  return <span className={`w-2 h-2 bg-orange-500 ${BORDER_RADIUS.badge}`} />;
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
        Showing {count} notification{count !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
};

// Helper function to get notification icon configuration
const getNotificationIconConfig = (type) => {
  const configs = {
    like: {
<<<<<<< HEAD
      icon: <Heart className="w-3 h-3 text-rose-500" />,
      bgClass: "bg-rose-100 dark:bg-rose-900",
    },
    comment: {
      icon: <MessageCircle className="w-3 h-3 text-blue-500" />,
      bgClass: "bg-blue-100 dark:bg-blue-900",
    },
    follow: {
      icon: <UserPlus className="w-3 h-3 text-emerald-500" />,
      bgClass: "bg-emerald-100 dark:bg-emerald-900",
    },
    mention: {
      icon: <User className="w-3 h-3 text-orange-500" />,
      bgClass: "bg-orange-100 dark:bg-orange-900",
    },
    friend_request: {
      icon: <Users className="w-3 h-3 text-purple-500" />,
      bgClass: "bg-purple-100 dark:bg-purple-900",
=======
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      bgClass: 'bg-rose-50 dark:bg-rose-500/20',
    },
    comment: {
      icon: <MessageCircle className="w-4 h-4 text-blue-500" />,
      bgClass: 'bg-blue-50 dark:bg-blue-500/20',
    },
    follow: {
      icon: <UserPlus className="w-4 h-4 text-emerald-500" />,
      bgClass: 'bg-emerald-50 dark:bg-emerald-500/20',
    },
    mention: {
      icon: <User className="w-4 h-4 text-orange-500" />,
      bgClass: 'bg-orange-50 dark:bg-orange-500/20',
    },
    friend_request: {
      icon: <Users className="w-4 h-4 text-purple-500" />,
      bgClass: 'bg-purple-50 dark:bg-purple-500/20',
>>>>>>> c54d32b27c727901701da85adb2ed9bf2b8c9945
    },
  };

  return (
    configs[type] || {
<<<<<<< HEAD
      icon: <Bell className="w-3 h-3 text-slate-400" />,
      bgClass: "bg-slate-100 dark:bg-slate-700",
=======
      icon: <Bell className="w-4 h-4 text-slate-400" />,
      bgClass: 'bg-slate-50 dark:bg-slate-700',
>>>>>>> c54d32b27c727901701da85adb2ed9bf2b8c9945
    }
  );
};

export default NotificationsTab;
export {
  NotificationsHeader,
  NotificationItem,
  NotificationAvatar,
  NotificationIconBadge,
  NotificationContent,
  UnreadDot,
  NotificationsFooter,
  getNotificationIconConfig,
};
