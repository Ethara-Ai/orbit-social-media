/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

// Import Data
import { currentUser, friends, suggestedUsers } from "../../data/mockData";

// Import Utils
import { shuffleArray } from "../../utils/helpers";
import { MAX_ACTIVE_FRIENDS } from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const UserContext = createContext(null);

// ============================================================================
// User Provider
// Self-contained provider managing user-related state and actions
// ============================================================================

export function UserProvider({ children }) {
  // ==========================================================================
  // User State
  // ==========================================================================
  const [currentUserAvatar] = useState(currentUser.avatar);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  // Randomized active friends - shuffles on each page load
  const [activeOnlineFriends] = useState(() => {
    const onlineFriends = friends.filter((f) => f.isOnline);
    return shuffleArray(onlineFriends).slice(0, MAX_ACTIVE_FRIENDS);
  });

  // ==========================================================================
  // User Handlers
  // ==========================================================================

  const sendConnectionRequest = useCallback((userId) => {
    setConnectionRequests((prev) => {
      if (prev.includes(userId)) return prev;
      return [...prev, userId];
    });
  }, []);

  const handleViewProfile = useCallback((user) => {
    console.log("View profile:", user?.name);
    setSelectedProfileUser(user);
  }, []);

  const clearSelectedProfile = useCallback(() => {
    setSelectedProfileUser(null);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      currentUser,
      currentUserAvatar,
      friends,
      suggestedUsers,
      activeOnlineFriends,
      connectionRequests,
      selectedProfileUser,
      // Actions
      sendConnectionRequest,
      handleViewProfile,
      clearSelectedProfile,
    }),
    [
      currentUserAvatar,
      activeOnlineFriends,
      connectionRequests,
      selectedProfileUser,
      sendConnectionRequest,
      handleViewProfile,
      clearSelectedProfile,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default UserContext;
