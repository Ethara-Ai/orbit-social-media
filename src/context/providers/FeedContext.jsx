import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

// Import Data
import {
  currentUser,
  friends,
  createMockPosts,
  createInitialComments,
} from "../../data/mockData";

// Import Services
import {
  createPost,
  toggleLikeById,
  incrementSharesById,
  incrementCommentsById,
  addPost,
  createComment,
  addComment,
  toggleCommentVisibility,
  copyPostUrlToClipboard,
} from "../../services/postService";

// Import Utils
import { processImageFile } from "../../utils/helpers";
import { COPY_NOTIFICATION_DURATION } from "../../utils/constants";

// ============================================================================
// Context Definition
// ============================================================================

const FeedContext = createContext(null);

// ============================================================================
// Feed Provider
// Self-contained provider managing feed-related state and actions
// ============================================================================

export function FeedProvider({ children }) {
  // ==========================================================================
  // Initialize Mock Data
  // ==========================================================================
  const mockPosts = useMemo(() => createMockPosts(friends), []);
  const initialComments = useMemo(() => createInitialComments(friends), []);

  // ==========================================================================
  // Feed State
  // ==========================================================================
  const [posts, setPosts] = useState(mockPosts);
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  // ==========================================================================
  // Feed Handlers
  // ==========================================================================

  const handleLike = useCallback((postId) => {
    setPosts((prev) => toggleLikeById(prev, postId));
  }, []);

  const handleComment = useCallback((postId) => {
    setShowComments((prev) => toggleCommentVisibility(prev, postId));
  }, []);

  const handleAddComment = useCallback(
    (postId) => {
      const commentText = newComment[postId];
      if (!commentText?.trim()) return;

      const newCommentObj = createComment({
        user: currentUser,
        content: commentText,
        postId,
      });

      setComments((prev) => addComment(prev, newCommentObj));
      setPosts((prev) => incrementCommentsById(prev, postId));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    },
    [newComment],
  );

  const handleShare = useCallback(async (postId) => {
    const success = await copyPostUrlToClipboard(postId);
    setPosts((prev) => incrementSharesById(prev, postId));
    setShowCopyNotification(true);
    setTimeout(
      () => setShowCopyNotification(false),
      COPY_NOTIFICATION_DURATION,
    );
    return success;
  }, []);

  const handleCreatePost = useCallback(() => {
    if (!newPostContent.trim() && !selectedImage) return;

    const newPost = createPost({
      user: currentUser,
      content: newPostContent,
      image: selectedImage,
      category: "Personal",
    });

    setPosts((prev) => addPost(prev, newPost));
    setNewPostContent("");
    setSelectedImage(null);
  }, [newPostContent, selectedImage]);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    const dataUrl = await processImageFile(file);
    if (dataUrl) {
      setSelectedImage(dataUrl);
    }
  }, []);

  const handlePostClick = useCallback((postId) => {
    console.log("Post clicked:", postId);
    setSelectedPost(postId);
  }, []);

  const clearSelectedPost = useCallback(() => {
    setSelectedPost(null);
  }, []);

  // ==========================================================================
  // Context Value
  // ==========================================================================

  const contextValue = useMemo(
    () => ({
      // Data
      currentUser,
      posts,
      comments,
      showComments,
      newComment,
      newPostContent,
      selectedImage,
      selectedPost,
      showCopyNotification,
      // Setters
      setNewComment,
      setNewPostContent,
      setSelectedImage,
      setSelectedPost,
      setShowCopyNotification,
      // Actions
      handleLike,
      handleComment,
      handleAddComment,
      handleShare,
      handleCreatePost,
      handleImageUpload,
      handlePostClick,
      clearSelectedPost,
    }),
    [
      posts,
      comments,
      showComments,
      newComment,
      newPostContent,
      selectedImage,
      selectedPost,
      showCopyNotification,
      handleLike,
      handleComment,
      handleAddComment,
      handleShare,
      handleCreatePost,
      handleImageUpload,
      handlePostClick,
      clearSelectedPost,
    ],
  );

  return (
    <FeedContext.Provider value={contextValue}>{children}</FeedContext.Provider>
  );
}

// ============================================================================
// Custom Hook
// ============================================================================

export function useFeed() {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}

export default FeedContext;
