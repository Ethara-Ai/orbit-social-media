import { useRef, useCallback, useEffect } from 'react';
import { TABS } from '../utils/constants';

/**
 * Custom hook to preserve and restore scroll positions for each tab
 * This enables independent scrolling for each tab, maintaining position
 * when switching between tabs.
 *
 * @param {string} activeTab - The currently active tab identifier
 * @returns {Object} - Object containing scroll management utilities
 */
const useScrollPosition = (activeTab) => {
  // Store scroll positions for each tab
  const scrollPositions = useRef({
    [TABS.FEED]: 0,
    [TABS.EXPLORE]: 0,
    [TABS.MESSAGES]: 0,
    [TABS.NOTIFICATIONS]: 0,
  });

  // Store refs to each tab's scrollable container
  const scrollContainerRefs = useRef({
    [TABS.FEED]: null,
    [TABS.EXPLORE]: null,
    [TABS.MESSAGES]: null,
    [TABS.NOTIFICATIONS]: null,
  });

  // Track the previous active tab
  const previousTab = useRef(activeTab);

  /**
   * Save the current scroll position for a specific tab
   * @param {string} tabId - The tab identifier
   */
  const saveScrollPosition = useCallback((tabId) => {
    const container = scrollContainerRefs.current[tabId];
    if (container) {
      scrollPositions.current[tabId] = container.scrollTop;
    }
  }, []);

  /**
   * Restore the scroll position for a specific tab
   * @param {string} tabId - The tab identifier
   */
  const restoreScrollPosition = useCallback((tabId) => {
    const container = scrollContainerRefs.current[tabId];
    if (container) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        container.scrollTop = scrollPositions.current[tabId];
      });
    }
  }, []);

  /**
   * Register a scroll container ref for a tab
   * @param {string} tabId - The tab identifier
   * @returns {Function} - Ref callback function
   */
  const registerScrollContainer = useCallback((tabId) => {
    return (element) => {
      scrollContainerRefs.current[tabId] = element;
    };
  }, []);

  /**
   * Get the ref callback for a specific tab
   * @param {string} tabId - The tab identifier
   * @returns {HTMLElement|null} - The scroll container element
   */
  const getScrollContainer = useCallback((tabId) => {
    return scrollContainerRefs.current[tabId];
  }, []);

  /**
   * Reset scroll position for a specific tab to top
   * @param {string} tabId - The tab identifier
   */
  const resetScrollPosition = useCallback((tabId) => {
    scrollPositions.current[tabId] = 0;
    const container = scrollContainerRefs.current[tabId];
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  /**
   * Reset all scroll positions to top
   */
  const resetAllScrollPositions = useCallback(() => {
    Object.keys(TABS).forEach((key) => {
      const tabId = TABS[key];
      scrollPositions.current[tabId] = 0;
      const container = scrollContainerRefs.current[tabId];
      if (container) {
        container.scrollTop = 0;
      }
    });
  }, []);

  /**
   * Handle scroll event to continuously track position
   * @param {string} tabId - The tab identifier
   * @returns {Function} - Scroll event handler
   */
  const createScrollHandler = useCallback((tabId) => {
    return () => {
      const container = scrollContainerRefs.current[tabId];
      if (container) {
        scrollPositions.current[tabId] = container.scrollTop;
      }
    };
  }, []);

  // Handle tab changes - save previous and restore current
  useEffect(() => {
    if (previousTab.current !== activeTab) {
      // Save scroll position of the tab we're leaving
      saveScrollPosition(previousTab.current);

      // Restore scroll position of the tab we're entering
      restoreScrollPosition(activeTab);

      // Update previous tab reference
      previousTab.current = activeTab;
    }
  }, [activeTab, saveScrollPosition, restoreScrollPosition]);

  return {
    // Core functions
    saveScrollPosition,
    restoreScrollPosition,
    registerScrollContainer,
    getScrollContainer,

    // Utility functions
    resetScrollPosition,
    resetAllScrollPositions,
    createScrollHandler,

    // Direct access to positions (read-only use recommended)
    getScrollPositions: () => ({ ...scrollPositions.current }),
  };
};

export default useScrollPosition;
