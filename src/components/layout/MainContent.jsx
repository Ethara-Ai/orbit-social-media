import { lazy, Suspense, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useTab } from '../../context/providers/ui';
import { useMessagesActions } from '../../hooks/useMessagesActions';
import { TABS, BORDER_RADIUS } from '../../utils/constants';
import { InlineErrorBoundary } from '../common/ErrorBoundary';

// Lazy load tab components for better initial bundle size
const FeedTab = lazy(() => import('../feed/FeedTab'));
const ExploreTab = lazy(() => import('../explore/ExploreTab'));
const MessagesTab = lazy(() => import('../messages/MessagesTab'));
const NotificationsTab = lazy(() => import('../notifications/NotificationsTab'));
const ConnectionsTab = lazy(() => import('../connections/ConnectionsTab'));
const ProfileTab = lazy(() => import('../profile/ProfileTab'));

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
      <div
        className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} p-4 border border-slate-200 dark:border-slate-700`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 bg-slate-200 dark:bg-slate-700 ${BORDER_RADIUS.avatar}`} />
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
      <div
        className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} p-4 border border-slate-200 dark:border-slate-700`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 bg-slate-200 dark:bg-slate-700 ${BORDER_RADIUS.avatar}`} />
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
      <div
        className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} p-4 border border-slate-200 dark:border-slate-700`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 bg-slate-200 dark:bg-slate-700 ${BORDER_RADIUS.avatar}`} />
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
 * MainContent - Orchestrator Component
 *
 * This component:
 * 1. Renders the active tab content
 * 2. Uses React.lazy() for code splitting - tabs load on demand
 * 3. Wraps each tab in InlineErrorBoundary for graceful error handling
 * 4. Content scrolling is handled by parent container in SocialMediaDashboard
 */
const MainContent = () => {
  // Use focused hook for better performance - only re-renders when tab state changes
  const { activeTab, isLeavingMessagesTab } = useTab();
  const { cleanupEmptyConvos } = useMessagesActions();

  // Cleanup empty conversations when leaving messages tab
  useEffect(() => {
    if (isLeavingMessagesTab) {
      cleanupEmptyConvos();
    }
  }, [isLeavingMessagesTab, cleanupEmptyConvos]);

  // Tab wrapper styles - keeps tab mounted but hidden when not active
  const getTabWrapperClass = (tabId) => {
    const isActive = activeTab === tabId;
    return isActive ? 'block' : 'hidden';
  };

  return (
    <main className="w-full min-w-0">
      {/* Feed Tab */}
      <div className={getTabWrapperClass(TABS.FEED)}>
        <InlineErrorBoundary fallbackMessage="Failed to load feed. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>

      {/* Explore Tab */}
      <div className={getTabWrapperClass(TABS.EXPLORE)}>
        <InlineErrorBoundary fallbackMessage="Failed to load explore content. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>

      {/* Messages Tab */}
      <div className={getTabWrapperClass(TABS.MESSAGES)}>
        <InlineErrorBoundary fallbackMessage="Failed to load messages. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>

      {/* Notifications Tab */}
      <div className={getTabWrapperClass(TABS.NOTIFICATIONS)}>
        <InlineErrorBoundary fallbackMessage="Failed to load notifications. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>

      {/* Connections Tab */}
      <div className={getTabWrapperClass(TABS.CONNECTIONS)}>
        <InlineErrorBoundary fallbackMessage="Failed to load connections. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>

      {/* Profile Tab */}
      <div className={getTabWrapperClass(TABS.PROFILE)}>
        <InlineErrorBoundary fallbackMessage="Failed to load profile. Please try refreshing the page.">
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
        </InlineErrorBoundary>
      </div>
    </main>
  );
};

export default MainContent;
