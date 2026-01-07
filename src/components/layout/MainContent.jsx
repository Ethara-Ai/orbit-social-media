import { useEffect } from "react";
import { motion } from "framer-motion";
import { useUI, useMessages } from "../../context/AppContext";
import { useScrollPosition } from "../../hooks";
import { TABS } from "../../utils/constants";
import FeedTab from "../feed/FeedTab";
import ExploreTab from "../explore/ExploreTab";
import MessagesTab from "../messages/MessagesTab";
import NotificationsTab from "../notifications/NotificationsTab";

/**
 * MainContent - Orchestrator Component with Independent Tab Scrolling
 *
 * This component:
 * 1. Keeps all tabs mounted to preserve their state
 * 2. Each tab has its own independent scrollable container
 * 3. Scroll positions are preserved when switching between tabs
 * 4. Uses CSS visibility/display to show/hide tabs without unmounting
 */
const MainContent = () => {
  const { activeTab, isLeavingMessagesTab } = useUI();
  const { cleanupEmptyConvos } = useMessages();
  const { registerScrollContainer, createScrollHandler } =
    useScrollPosition(activeTab);

  // Cleanup empty conversations when leaving messages tab
  useEffect(() => {
    if (isLeavingMessagesTab) {
      cleanupEmptyConvos();
    }
  }, [isLeavingMessagesTab, cleanupEmptyConvos]);

  // Common scroll container styles
  const scrollContainerClass =
    "h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden custom-scrollbar";

  // Tab wrapper styles - keeps tab mounted but hidden when not active
  const getTabWrapperClass = (tabId) => {
    const isActive = activeTab === tabId;
    return `absolute inset-0 ${isActive ? "visible z-10" : "invisible z-0"}`;
  };

  return (
    <main className="flex-1 w-full min-w-0 lg:ml-64 xl:mr-80 overflow-hidden relative">
      {/* Feed Tab */}
      <div className={getTabWrapperClass(TABS.FEED)}>
        <div
          ref={registerScrollContainer(TABS.FEED)}
          onScroll={createScrollHandler(TABS.FEED)}
          className={scrollContainerClass}
        >
          <div className="p-2 sm:p-4 lg:p-6 w-full max-w-full">
            {activeTab === TABS.FEED ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FeedTab />
              </motion.div>
            ) : (
              <FeedTab />
            )}
          </div>
        </div>
      </div>

      {/* Explore Tab */}
      <div className={getTabWrapperClass(TABS.EXPLORE)}>
        <div
          ref={registerScrollContainer(TABS.EXPLORE)}
          onScroll={createScrollHandler(TABS.EXPLORE)}
          className={scrollContainerClass}
        >
          <div className="p-2 sm:p-4 lg:p-6 w-full max-w-full">
            {activeTab === TABS.EXPLORE ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExploreTab />
              </motion.div>
            ) : (
              <ExploreTab />
            )}
          </div>
        </div>
      </div>

      {/* Messages Tab */}
      <div className={getTabWrapperClass(TABS.MESSAGES)}>
        <div
          ref={registerScrollContainer(TABS.MESSAGES)}
          onScroll={createScrollHandler(TABS.MESSAGES)}
          className={scrollContainerClass}
        >
          <div className="p-2 sm:p-4 lg:p-6 w-full max-w-full">
            {activeTab === TABS.MESSAGES ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessagesTab />
              </motion.div>
            ) : (
              <MessagesTab />
            )}
          </div>
        </div>
      </div>

      {/* Notifications Tab */}
      <div className={getTabWrapperClass(TABS.NOTIFICATIONS)}>
        <div
          ref={registerScrollContainer(TABS.NOTIFICATIONS)}
          onScroll={createScrollHandler(TABS.NOTIFICATIONS)}
          className={scrollContainerClass}
        >
          <div className="p-2 sm:p-4 lg:p-6 w-full max-w-full">
            {activeTab === TABS.NOTIFICATIONS ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NotificationsTab />
              </motion.div>
            ) : (
              <NotificationsTab />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
