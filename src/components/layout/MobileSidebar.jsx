// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, MessageCircle, Bell, X, User } from "../icons";
import UserProfileCard from "../sidebar/UserProfileCard";
import NavigationItems from "../sidebar/NavigationItems";
import ProfileAnalytics from "../sidebar/ProfileAnalytics";
import {
  useUser,
  useUI,
  useMessages,
  useNotifications,
  useFeed,
} from "../../context/AppContext";
import {
  INITIAL_PROFILE_POSTS,
  PROFILE_DATA,
  BORDER_RADIUS,
} from "../../utils/constants";

const MobileSidebar = () => {
  const { posts } = useFeed();
  const { currentUser, currentUserAvatar, currentUserDetails } = useUser();
  const { activeTab, setActiveTab, showMobileNav, setShowMobileNav } = useUI();
  const { totalUnreadMessages } = useMessages();
  const { notificationCount, markNotificationsAsRead } = useNotifications();

  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "explore", label: "Discover", icon: Search },
    { id: "messages", label: "Chats", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  const handleNavigateToProfile = () => {
    setActiveTab("profile");
    setShowMobileNav(false);
  };

  const handleMobileNavigate = () => {
    setShowMobileNav(false);
  };

  return (
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

          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 min-h-0 space-y-3">
            {/* User Profile Card */}
            <UserProfileCard
              user={{
                ...currentUser,
                name: currentUserDetails.name,
                profession: currentUserDetails.profession,
              }}
              avatar={currentUserAvatar}
              onClick={handleNavigateToProfile}
              stats={{
                posts:
                  posts.filter((p) => p.user.id === currentUser.id).length +
                  INITIAL_PROFILE_POSTS.length,
                followers: PROFILE_DATA.followers,
                following: PROFILE_DATA.following,
              }}
              animated={false}
            />

            {/* Profile Analytics Section */}
            <ProfileAnalytics />

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
  );
};

const MobileSidebarHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 bg-linear-to-br from-orange-500 to-amber-500 ${BORDER_RADIUS.cardSmall} flex items-center justify-center`}>
          <span className="text-white font-bold">O</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white transition-colors">
          Orbit
        </span>
      </div>
      <motion.button
        onClick={onClose}
        className={`p-2 ${BORDER_RADIUS.cardSmall} hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
      </motion.button>
    </div>
  );
};

export default MobileSidebar;
