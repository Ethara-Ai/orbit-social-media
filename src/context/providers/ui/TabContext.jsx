/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { scrollToTop } from '../../../utils/domUtils';
import { TABS } from '../../../utils/constants';

// ============================================================================
// Context Definition
// ============================================================================

const TabContext = createContext(null);
TabContext.displayName = 'TabContext';

// ============================================================================
// Tab Provider
// Focused provider for tab navigation state only
// ============================================================================

export function TabProvider({ children }) {
  const [activeTab, setActiveTabState] = useState(TABS.FEED);
  const [previousTab, setPreviousTab] = useState(null);
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const [pendingProfilePost, setPendingProfilePost] = useState(null); // { postId, openComments, fromNotifications }

  // Track if we're leaving the messages tab (used by MessagesTab to cleanup)
  const isLeavingMessagesTab = useMemo(
    () => previousTab === TABS.MESSAGES && activeTab !== TABS.MESSAGES,
    [previousTab, activeTab]
  );

  const setActiveTab = useCallback(
    (newTab) => {
      setPreviousTab(activeTab);
      setActiveTabState(newTab);
      scrollToTop();
    },
    [activeTab]
  );

  const contextValue = useMemo(
    () => ({
      activeTab,
      previousTab,
      isLeavingMessagesTab,
      setActiveTab,
      highlightedPostId,
      setHighlightedPostId,
      pendingProfilePost,
      setPendingProfilePost,
    }),
    [
      activeTab,
      previousTab,
      isLeavingMessagesTab,
      setActiveTab,
      highlightedPostId,
      pendingProfilePost,
    ]
  );

  return <TabContext.Provider value={contextValue}>{children}</TabContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useTab() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
}

export default TabContext;
