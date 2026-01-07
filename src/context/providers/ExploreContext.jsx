/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

// Import Data
import {
  friends,
  createExplorePosts,
  exploreCategories,
} from "../../data/mockData";

// Import Services
import { toggleLikeById } from "../../services/postService";

// ============================================================================
// Context Definition
// ============================================================================

const ExploreContext = createContext(null);

// ============================================================================
// Explore Provider
// Self-contained provider managing explore-related state and actions
// ============================================================================

export function ExploreProvider({ children }) {
  // ==========================================================================
  // Initialize Mock Data
  // ==========================================================================
  const explorePosts = useMemo(() => createExplorePosts(friends), []);

  // ==========================================================================
  // Explore State
  // ==========================================================================
  const [explorePostsState, setExplorePostsState] = useState(explorePosts);
  const [activeExploreCategory, setActiveExploreCategory] = useState(null);
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [selectedExplorePost, setSelectedExplorePost] = useState(null);

  // ==========================================================================
  // Explore Handlers
  // ==========================================================================

  const handleExploreLike = useCallback((postId) => {
    setExplorePostsState((prev) => toggleLikeById(prev, postId));
  }, []);

  const handleExplorePostClick = useCallback((post) => {
    console.log("View explore post:", post?.title);
    setSelectedExplorePost(post);
    setShowExploreModal(true);
  }, []);

  const closeExploreModal = useCallback(() => {
    setShowExploreModal(false);
    setSelectedExplorePost(null);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      explorePosts: explorePostsState,
      exploreCategories,
      activeExploreCategory,
      showExploreModal,
      selectedExplorePost,
      // Setters
      setExplorePosts: setExplorePostsState,
      setActiveExploreCategory,
      setShowExploreModal,
      setSelectedExplorePost,
      // Actions
      handleExploreLike,
      handleExplorePostClick,
      closeExploreModal,
    }),
    [
      explorePostsState,
      activeExploreCategory,
      showExploreModal,
      selectedExplorePost,
      handleExploreLike,
      handleExplorePostClick,
      closeExploreModal,
    ],
  );

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useExplore() {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error("useExplore must be used within an ExploreProvider");
  }
  return context;
}

export default ExploreContext;
