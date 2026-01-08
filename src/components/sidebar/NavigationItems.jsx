// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Badge from "../common/Badge";

const NavigationItems = ({
  navItems,
  activeTab,
  setActiveTab,
  notificationCount,
  totalUnreadMessages,
  markNotificationsAsRead,
  onNavigate,
  isMobile = false,
}) => {
  const handleNavClick = (item) => {
    setActiveTab(item.id);
    if (item.id === "notifications") {
      markNotificationsAsRead();
    }
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav className="space-y-0.5 py-1">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        const showNotificationBadge =
          item.id === "notifications" && notificationCount > 0;
        const showMessagesBadge =
          item.id === "messages" && totalUnreadMessages > 0;

        return (
          <motion.button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${
              isActive
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            whileHover={!isMobile && !isActive ? { x: 2 } : undefined}
            whileTap={{ scale: 0.99 }}
          >
            <IconComponent className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm flex-1 text-left">
              {item.label}
            </span>

            {showNotificationBadge && (
              <Badge
                count={notificationCount}
                variant={isActive ? "light" : "danger"}
              />
            )}

            {showMessagesBadge && (
              <Badge
                count={totalUnreadMessages}
                variant={isActive ? "light" : "primary"}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

export default NavigationItems;
