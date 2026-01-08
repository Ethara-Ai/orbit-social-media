import { lazy, Suspense, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUI, useMessages } from "../../context/AppContext";
import { useScrollPosition } from "../../hooks";
import { TABS } from "../../utils/constants";

// Lazy load tab components for better initial bundle size
const FeedTab = lazy(() => import("../feed/FeedTab"));
const ExploreTab = lazy(() => import("../explore/ExploreTab"));
const MessagesTab = lazy(() => import("../messages/MessagesTab"));
const NotificationsTab = lazy(
  () => import("../notifications/NotificationsTab"),
);
const ConnectionsTab = lazy(() => import("../connections/ConnectionsTab"));
const ProfileTab = lazy(() => import("../profile/ProfileTab"));

/**
 * TabLoadingFallback - Skeleton loader shown while tab components load
 */
const TabLoadingFallback = () => (
  <div className="w-full animate-pulse">
    {/* Header skeleton */}
    <div className="mb-6">
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-32" />
    </div>

    {/* Content skeleton */}
    <div className="space-y-4">
      {/* Card skeleton 1 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-32 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-sm w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-3/4" />
        </div>
      </div>

      {/* Card skeleton 2 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-40 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-sm w-20" />
          </div>
        </div>
        <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-1/2" />
        </div>
      </div>

      {/* Card skeleton 3 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-36 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-sm w-28" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-full" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-5/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-sm w-2/3" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * MainContent - Orchestrator Component with Independent Tab Scrolling
 *
 * This component:
 * 1. Keeps all tabs mounted to preserve their state
 * 2. Each tab has its own independent scrollable container
 * 3. Scroll positions are preserved when switching between tabs
 * 4. Uses CSS visibility/display to show/hide tabs without unmounting
 * 5. Uses React.lazy() for code splitting - tabs load on demand
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

  const scrollContainerClass = "custom-scrollbar";

  // Tab wrapper styles - keeps tab mounted but hidden when not active
  const getTabWrapperClass = (tabId) => {
    const isActive = activeTab === tabId;
    return isActive ? "block" : "hidden";
  };

  return (
    <main className="w-full min-w-0 min-h-[calc(100vh-7rem)]">
      {/* Feed Tab */}
      <div className={getTabWrapperClass(TABS.FEED)}>
        <div
          ref={registerScrollContainer(TABS.FEED)}
          onScroll={createScrollHandler(TABS.FEED)}
          className={scrollContainerClass}
        >
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
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
            </Suspense>
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
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
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
            </Suspense>
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
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
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
            </Suspense>
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
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
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
            </Suspense>
          </div>
        </div>
      </div>

      {/* Connections Tab */}
      <div className={getTabWrapperClass(TABS.CONNECTIONS)}>
        <div
          ref={registerScrollContainer(TABS.CONNECTIONS)}
          onScroll={createScrollHandler(TABS.CONNECTIONS)}
          className={scrollContainerClass}
        >
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
              {activeTab === TABS.CONNECTIONS ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConnectionsTab />
                </motion.div>
              ) : (
                <ConnectionsTab />
              )}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Profile Tab */}
      <div className={getTabWrapperClass(TABS.PROFILE)}>
        <div
          ref={registerScrollContainer(TABS.PROFILE)}
          onScroll={createScrollHandler(TABS.PROFILE)}
          className={scrollContainerClass}
        >
          <div className="w-full">
            <Suspense fallback={<TabLoadingFallback />}>
              {activeTab === TABS.PROFILE ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProfileTab />
                </motion.div>
              ) : (
                <ProfileTab />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
