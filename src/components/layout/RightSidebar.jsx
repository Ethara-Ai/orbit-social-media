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
  const { setActiveTab, isTheaterModeOpen } = useUI();

  // Handle navigation to messages tab when a conversation is started
  useEffect(() => {
    if (pendingNavigateToMessages) {
      setActiveTab(TABS.MESSAGES);
      clearPendingNavigation();
    }
  }, [pendingNavigateToMessages, setActiveTab, clearPendingNavigation]);

  return (
    <motion.aside
      className="fixed right-0 top-16 bottom-0 w-80 hidden xl:block border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar transition-colors duration-300"
      initial={{ x: 0, opacity: 1 }}
      animate={{
        x: isTheaterModeOpen ? 320 : 0,
        opacity: isTheaterModeOpen ? 0 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
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
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center transition-colors">
            © 2026 Orbit. Connect • Discover • Thrive
          </p>
        </div>
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
