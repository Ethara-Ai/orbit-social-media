// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, MessageCircle, Bell, X } from "../icons";
import UserProfileCard from "../sidebar/UserProfileCard";
import NavigationItems from "../sidebar/NavigationItems";
import {
  useUser,
  useUI,
  useMessages,
  useNotifications,
} from "../../context/AppContext";

const Sidebar = () => {
  const { currentUser, currentUserAvatar } = useUser();
  const {
    activeTab,
    setActiveTab,
    showMobileNav,
    setShowMobileNav,
    setShowCurrentUserModal,
  } = useUI();
  const { totalUnreadMessages } = useMessages();
  const { notificationCount, markNotificationsAsRead } = useNotifications();

  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "explore", label: "Discover", icon: Search },
    { id: "messages", label: "Chats", icon: MessageCircle },
    { id: "notifications", label: "Activity", icon: Bell },
  ];

  const handleOpenCurrentUserModal = () => {
    setShowCurrentUserModal(true);
  };

  const handleOpenCurrentUserModalMobile = () => {
    setShowCurrentUserModal(true);
    setShowMobileNav(false);
  };

  const handleMobileNavigate = () => {
    setShowMobileNav(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="space-y-4">
        {/* User Profile Card Section */}
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <UserProfileCard
            user={currentUser}
            avatar={currentUserAvatar}
            onClick={handleOpenCurrentUserModal}
          />
        </motion.div>

        {/* Navigation Section */}
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 transition-colors duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <NavigationItems
            navItems={navItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            notificationCount={notificationCount}
            totalUnreadMessages={totalUnreadMessages}
            markNotificationsAsRead={markNotificationsAsRead}
          />
        </motion.div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.aside
            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-50 lg:hidden shadow-2xl transition-colors duration-300 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Mobile Header */}
            <MobileSidebarHeader onClose={() => setShowMobileNav(false)} />

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 min-h-0">
              {/* User Profile Card */}
              <UserProfileCard
                user={currentUser}
                avatar={currentUserAvatar}
                onClick={handleOpenCurrentUserModalMobile}
                animated={false}
              />

              {/* Navigation with Separator */}
              <div className="border-t border-slate-100 dark:border-slate-700 pt-2">
                <NavigationItems
                  navItems={navItems}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  notificationCount={notificationCount}
                  totalUnreadMessages={totalUnreadMessages}
                  markNotificationsAsRead={markNotificationsAsRead}
                  onNavigate={handleMobileNavigate}
                  isMobile={true}
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

const MobileSidebarHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">O</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white transition-colors">
          Orbit
        </span>
      </div>
      <motion.button
        onClick={onClose}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </motion.button>
    </div>
  );
};

export default Sidebar;
