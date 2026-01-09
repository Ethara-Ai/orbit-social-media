// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Heart, MessageCircle, UserPlus, User, Bell, Users } from "../icons";
import Avatar from "../common/Avatar";
import { BORDER_RADIUS } from "../../utils/constants";

const NotificationItem = ({ notification, index, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(notification.user);
    }
  };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      className={`bg-white ${BORDER_RADIUS.card} p-4 shadow-xs border cursor-pointer transition-all ${!notification.isRead
        ? "border-orange-200 bg-orange-50/30"
        : "border-slate-200 hover:bg-slate-50"
        }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 2 }}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="flex items-center gap-4">
        <NotificationAvatar
          avatar={notification.user.avatar}
          name={notification.user.name}
          type={notification.type}
        />
        <NotificationContent notification={notification} />
      </div>
    </motion.div>
  );
};

const NotificationAvatar = ({ avatar, name, type }) => {
  return (
    <div className="relative shrink-0">
      <Avatar src={avatar} alt={name} size="xl" />
      <NotificationBadge type={type} />
    </div>
  );
};

const NotificationBadge = ({ type }) => {
  const { icon, bgClass } = getNotificationConfig(type);

  return (
    <div
      className={`absolute -bottom-0.5 -right-0.5 ${BORDER_RADIUS.badge} p-1 shadow-xs ${bgClass}`}
    >
      {icon}
    </div>
  );
};

const NotificationContent = ({ notification }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-900 text-sm">
          {notification.user.name}
        </span>
        {!notification.isRead && <UnreadIndicator />}
      </div>
      <p className="text-slate-600 text-sm">{notification.message}</p>
      <p className="text-slate-400 text-xs mt-1">{notification.timestamp}</p>
    </div>
  );
};

const UnreadIndicator = () => {
  return <span className={`w-2 h-2 bg-orange-500 ${BORDER_RADIUS.badge}`} />;
};

const getNotificationConfig = (type) => {
  const configs = {
    like: {
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
    },
    default: {
      icon: <Bell className="w-3 h-3 text-slate-400" />,
      bgClass: "bg-slate-100 dark:bg-slate-700",
    },
  };

  return configs[type] || configs.default;
};

export default NotificationItem;
