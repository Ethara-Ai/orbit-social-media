// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Home, Search, MessageCircle, Bell } from '../icons';
import UserProfileCard from '../sidebar/UserProfileCard';
import NavigationItems from '../sidebar/NavigationItems';
import ProfileAnalytics from '../sidebar/ProfileAnalytics';
import { INITIAL_PROFILE_POSTS, PROFILE_DATA, BORDER_RADIUS, TABS } from '../../utils/constants';
import { useUser, useMessages, useNotifications, useFeed } from '../../context/AppContext';
import { useTab } from '../../context/providers/ui';

const Sidebar = () => {
  const { currentUser, currentUserAvatar, currentUserDetails } = useUser();
  const { posts } = useFeed();
  // Use focused hook for better performance - only re-renders when tab state changes
  const { activeTab, setActiveTab } = useTab();
  const { totalUnreadMessages } = useMessages();
  const { notificationCount, markNotificationsAsRead } = useNotifications();

  const navItems = [
    { id: TABS.FEED, label: 'Home', icon: Home },
    { id: TABS.EXPLORE, label: 'Discover', icon: Search },
    { id: TABS.MESSAGES, label: 'Chats', icon: MessageCircle },
    { id: TABS.NOTIFICATIONS, label: 'Notifications', icon: Bell },
  ];

  const handleNavigateToProfile = () => {
    setActiveTab(TABS.PROFILE);
  };

  return (
    <div className="space-y-3">
      {/* User Profile Card Section */}
      <motion.div
        className={`bg-white dark:bg-neutral-900 ${BORDER_RADIUS.cardSmall} border border-slate-200 dark:border-neutral-700 p-3 transition-colors duration-300`}
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
        className={`bg-white dark:bg-neutral-900 ${BORDER_RADIUS.cardSmall} border border-slate-200 dark:border-neutral-700 p-3 transition-colors duration-300`}
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
