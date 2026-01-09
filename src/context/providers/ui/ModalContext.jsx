/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// ============================================================================
// Context Definition
// ============================================================================

const ModalContext = createContext(null);
ModalContext.displayName = 'ModalContext';

// ============================================================================
// Modal Provider
// Focused provider for modal and overlay state management
//
// This is part of the split from the monolithic UIContext to improve
// performance by reducing unnecessary re-renders.
// ============================================================================

export function ModalProvider({ children }) {
  // ==========================================================================
  // Modal State
  // ==========================================================================
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isTheaterModeOpen, setIsTheaterModeOpen] = useState(false);

  // ==========================================================================
  // Computed Values
  // ==========================================================================

  const isModalOpen = useMemo(
    () => showProfileModal || showCurrentUserModal || selectedPost !== null || isTheaterModeOpen,
    [showProfileModal, showCurrentUserModal, selectedPost, isTheaterModeOpen]
  );

  // ==========================================================================
  // Actions
  // ==========================================================================

  const closeAllModals = useCallback(() => {
    setShowProfileModal(false);
    setShowCurrentUserModal(false);
    setSelectedPost(null);
    setIsTheaterModeOpen(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setShowProfileModal(true);
  }, []);

  const openCurrentUserModal = useCallback(() => {
    setShowCurrentUserModal(true);
  }, []);

  const openTheaterMode = useCallback((post = null) => {
    if (post) {
      setSelectedPost(post);
    }
    setIsTheaterModeOpen(true);
  }, []);

  const closeTheaterMode = useCallback(() => {
    setIsTheaterModeOpen(false);
    setSelectedPost(null);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // State
      showCurrentUserModal,
      showProfileModal,
      selectedPost,
      isTheaterModeOpen,
      isModalOpen,

      // Setters (for flexibility)
      setShowCurrentUserModal,
      setShowProfileModal,
      setSelectedPost,
      setIsTheaterModeOpen,

      // Actions (preferred API)
      closeAllModals,
      openProfileModal,
      openCurrentUserModal,
      openTheaterMode,
      closeTheaterMode,
    }),
    [
      showCurrentUserModal,
      showProfileModal,
      selectedPost,
      isTheaterModeOpen,
      isModalOpen,
      closeAllModals,
      openProfileModal,
      openCurrentUserModal,
      openTheaterMode,
      closeTheaterMode,
    ]
  );

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default ModalContext;
