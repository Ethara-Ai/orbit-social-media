import { useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUser, useMessages, useUI } from "../../context/AppContext";
import { TABS } from "../../utils/constants";
import ActiveNowSection from "./RightSidebar/ActiveNowSection";
import SuggestedUsersSection from "./RightSidebar/SuggestedUsersSection";

const RightSidebar = () => {
  const {
    activeOnlineFriends,
    friends,
    suggestedUsers,
    connectionRequests,
    sendConnectionRequest,
    handleViewProfile,
  } = useUser();
  const {
    startConversation,
    pendingNavigateToMessages,
    clearPendingNavigation,
  } = useMessages();
  const { setActiveTab } = useUI();

  // Handle navigation to messages tab when a conversation is started
  useEffect(() => {
    if (pendingNavigateToMessages) {
      setActiveTab(TABS.MESSAGES);
      clearPendingNavigation();
    }
  }, [pendingNavigateToMessages, setActiveTab, clearPendingNavigation]);

  return (
    <motion.aside
      className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-4">
        {/* Active Now Section */}
        <ActiveNowSection
          activeOnlineFriends={activeOnlineFriends}
          friends={friends}
          startConversation={startConversation}
        />

        {/* Suggested Connections */}
        <SuggestedUsersSection
          suggestedUsers={suggestedUsers}
          connectionRequests={connectionRequests}
          sendConnectionRequest={sendConnectionRequest}
          handleViewProfile={handleViewProfile}
        />

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center transition-colors">
            © 2026 Orbit. Connect • Discover • Thrive
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
