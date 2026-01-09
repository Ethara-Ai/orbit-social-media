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
import { MAX_ACTIVE_FRIENDS, PROFILE_DATA } from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const UserContext = createContext(null);

// ============================================================================
// User Provider
// Self-contained provider managing user-related state and actions
//
// Encapsulation Strategy:
// - All state setters are kept internal - components interact only through
//   actions (sendConnectionRequest, updateUserAvatar, etc.)
// - This provides a clean API and prevents direct state manipulation
// - Profile and user data updates are encapsulated in dedicated action methods
// ============================================================================

export function UserProvider({ children }) {
  // ==========================================================================
  // User State
  // ==========================================================================
  const [currentUserAvatar, setCurrentUserAvatar] = useState(
    PROFILE_DATA.avatar,
  );
  const [currentUserCover, setCurrentUserCover] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState({
    name: currentUser.name,
    profession: currentUser.profession,
    location: currentUser.location,
    bio: `${currentUser.profession} passionate about design, technology, and creating meaningful experiences. Let's connect and build something amazing together! 🚀`,
  });
  const [profilePostComments, setProfilePostComments] = useState({});
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

  const updateUserAvatar = useCallback((newAvatar) => {
    setCurrentUserAvatar(newAvatar);
  }, []);

  const updateUserDetails = useCallback((newDetails) => {
    setCurrentUserDetails((prev) => ({ ...prev, ...newDetails }));
  }, []);

  const updateUserCover = useCallback((newCover) => {
    setCurrentUserCover(newCover);
  }, []);

  const toggleProfilePostComments = useCallback((postId) => {
    setProfilePostComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }, []);

  // ==========================================================================
  // Context Value
  //
  // Exposed to consumers:
  // - Read-only data (currentUser, friends, etc.)
  // - Actions only (no direct setters exposed)
  //
  // All state changes must go through actions for better encapsulation
  // and to ensure business logic consistency
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Read-only Data
      currentUser,
      currentUserAvatar,
      currentUserCover,
      currentUserDetails,
      profilePostComments,
      friends,
      suggestedUsers,
      activeOnlineFriends,
      connectionRequests,
      selectedProfileUser,
      // Actions (encapsulate all state changes)
      sendConnectionRequest,
      handleViewProfile,
      clearSelectedProfile,
      updateUserAvatar,
      updateUserCover,
      updateUserDetails,
      toggleProfilePostComments,
    }),
    [
      currentUserAvatar,
      currentUserCover,
      currentUserDetails,
      profilePostComments,
      activeOnlineFriends,
      connectionRequests,
      selectedProfileUser,
      sendConnectionRequest,
      handleViewProfile,
      clearSelectedProfile,
      updateUserAvatar,
      updateUserCover,
      updateUserDetails,
      toggleProfilePostComments,
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
