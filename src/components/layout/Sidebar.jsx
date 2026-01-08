// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Home, Search, MessageCircle, Bell } from "../icons";
import UserProfileCard from "../sidebar/UserProfileCard";
import NavigationItems from "../sidebar/NavigationItems";
import ProfileAnalytics from "../sidebar/ProfileAnalytics";
import { INITIAL_PROFILE_POSTS, PROFILE_DATA } from "../../utils/constants";
import {
  useUser,
  useUI,
  useMessages,

  useNotifications,
  useFeed,
} from "../../context/AppContext";

const Sidebar = () => {
  const { currentUser, currentUserAvatar, currentUserDetails } = useUser();
  const { posts } = useFeed();
  const { activeTab, setActiveTab, setShowCurrentUserModal } = useUI();
  const { totalUnreadMessages } = useMessages();
  const { notificationCount, markNotificationsAsRead } = useNotifications();

  const navItems = [
    { id: "feed", label: "Home", icon: Home },
    { id: "explore", label: "Discover", icon: Search },
    { id: "messages", label: "Chats", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleNavigateToProfile = () => {
    setActiveTab("profile");
  };

  return (
    <div className="space-y-3">
      {/* User Profile Card Section */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 transition-colors duration-300"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
        />
      </motion.div>

      {/* Navigation Section */}
      {/* Profile Analytics Section */}
      <ProfileAnalytics />

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
  );
};

export default Sidebar;
