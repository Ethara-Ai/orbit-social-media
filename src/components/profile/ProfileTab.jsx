import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useFeed } from "../../context/AppContext";
import { Heart, MessageCircle, Briefcase, MapPin, Share2 } from "../icons";
import {
  PROFILE_DATA,
  INITIAL_PROFILE_POSTS,
  BORDER_RADIUS,
} from "../../utils/constants";

// Mock comments for profile posts
const profilePostMockComments = {
  p1: [
    {
      id: "pc1",
      user: {
        name: "Zara Chen",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      },
      content: "Absolutely breathtaking view! 😍 Where was this taken?",
      timestamp: "2 hours ago",
    },
    {
      id: "pc2",
      user: {
        name: "Lucas Rivera",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      },
      content: "The mountains are calling! Great shot 🏔️",
      timestamp: "1 hour ago",
    },
  ],
  p2: [
    {
      id: "pc3",
      user: {
        name: "Emma Watson",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      content: "Golden hour is always magical ✨",
      timestamp: "3 hours ago",
    },
    {
      id: "pc4",
      user: {
        name: "James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      content: "Such stunning colors! What camera did you use?",
      timestamp: "2 hours ago",
    },
    {
      id: "pc5",
      user: {
        name: "Sophia Lee",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      content: "This should be on a postcard! Beautiful! 🌅",
      timestamp: "1 hour ago",
    },
  ],
  p3: [
    {
      id: "pc6",
      user: {
        name: "Nathan Park",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      content: "Adventure awaits! Love the composition 🌄",
      timestamp: "5 hours ago",
    },
  ],
  p4: [
    {
      id: "pc7",
      user: {
        name: "Zara Chen",
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      },
      content: "Nature therapy at its finest 🌲💚",
      timestamp: "4 hours ago",
    },
    {
      id: "pc8",
      user: {
        name: "Lucas Rivera",
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      },
      content: "This makes me want to go hiking!",
      timestamp: "3 hours ago",
    },
  ],
  p5: [
    {
      id: "pc9",
      user: {
        name: "Emma Watson",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      content: "The sound of waterfalls is so calming 💧",
      timestamp: "6 hours ago",
    },
  ],
  p6: [
    {
      id: "pc10",
      user: {
        name: "James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      content: "Moody vibes! Perfect atmosphere 🌫️",
      timestamp: "8 hours ago",
    },
    {
      id: "pc11",
      user: {
        name: "Sophia Lee",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      content: "Early mornings are worth it for views like this!",
      timestamp: "7 hours ago",
    },
  ],
};

const ProfileTab = () => {
  const { currentUser, profilePostComments, toggleProfilePostComments } =
    useUser();
  const { posts: feedPosts } = useFeed();

  const [activeTab, setActiveTab] = useState("posts");
  const [profilePosts, setProfilePosts] = useState(INITIAL_PROFILE_POSTS);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [newComment, setNewComment] = useState({});
  const [profileComments, setProfileComments] = useState(
    profilePostMockComments,
  );

  // Get user's posts from feed (posts created by current user)
  const userFeedPosts = feedPosts.filter(
    (post) => post.user.id === currentUser.id,
  );

  // Combine user's feed posts with profile posts
  const allUserPosts = [
    ...userFeedPosts.map((post) => ({
      id: post.id,
      image: post.image,
      likes: post.likes,
      comments: post.comments,
      caption: post.content,
      isLiked: post.isLiked,
      timestamp: post.timestamp,
      user: post.user,
    })),
    ...profilePosts,
  ];

  const stats = {
    posts: allUserPosts.length,
    followers: PROFILE_DATA.followers,
    following: PROFILE_DATA.following,
  };

  const tabs = [
    { id: "posts", label: "Posts", count: allUserPosts.length },
    { id: "about", label: "About", count: null },
  ];

  // Handle like interaction
  const handleLike = (postId) => {
    setProfilePosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
          : post,
      ),
    );
  };

  // Handle share profile
  const handleShareProfile = () => {
    const profileUrl = `https://orbit.social/${PROFILE_DATA.username.replace("@", "")}`;
    navigator.clipboard.writeText(profileUrl);
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 2000);
  };

  // Handle comment toggle
  const handleCommentToggle = (postId) => {
    toggleProfilePostComments(postId);
  };

  // Handle add comment - uses static profile data
  const handleAddComment = (postId) => {
    if (!newComment[postId]?.trim()) return;

    // Create new comment with static profile data
    const newCommentObj = {
      id: `pc-${Date.now()}`,
      user: {
        name: PROFILE_DATA.name,
        avatar: PROFILE_DATA.avatar,
      },
      content: newComment[postId],
      timestamp: "Just now",
    };

    // Add comment to the post's comments
    setProfileComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj],
    }));

    // Update comment count
    setProfilePosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post,
      ),
    );

    // Clear the comment input
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div
      className={`max-w-4xl mx-auto w-full pb-8 bg-white dark:bg-slate-900 ${BORDER_RADIUS.card}`}
    >
      {/* Copy Profile Link Popup */}
      <AnimatePresence>
        {showCopyPopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 ${BORDER_RADIUS.cardSmall} shadow-lg text-sm font-medium`}
          >
            Profile link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header Section */}
      <div className="relative">
        {/* Cover Photo */}
        <motion.div
          className="h-32 sm:h-48 md:h-56 rounded-t-xl relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={PROFILE_DATA.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </motion.div>

        {/* Profile Picture */}
        <motion.div
          className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <img
              src={PROFILE_DATA.avatar}
              alt={PROFILE_DATA.name}
              className={`w-24 h-24 sm:w-32 sm:h-32 ${BORDER_RADIUS.avatar} border-4 border-white dark:border-slate-900 object-cover shadow-lg`}
            />
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 ${BORDER_RADIUS.badge} border-2 border-white dark:border-slate-900`}
            />
          </div>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 sm:pt-20 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {PROFILE_DATA.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {PROFILE_DATA.username}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {PROFILE_DATA.profession}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {PROFILE_DATA.location}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleShareProfile}
              className={`flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 ${BORDER_RADIUS.cardSmall} text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              Share Profile
            </motion.button>
          </motion.div>
        </div>

        {/* Bio */}
        <motion.p
          className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {PROFILE_DATA.bio}
        </motion.p>

        {/* Stats */}
        <motion.div
          className="flex items-center gap-6 sm:gap-8 mt-5 py-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="text-[16px] font-bold text-slate-900 dark:text-white">
              {stats.posts}
            </span>
            <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Posts
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="text-[16px] font-bold text-slate-900 dark:text-white">
              {stats.followers}
            </span>
            <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Followers
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
            <span className="text-[16px] font-bold text-slate-900 dark:text-white">
              {stats.following}
            </span>
            <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Following
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer ${activeTab === tab.id
                  ? "text-orange-500"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1 text-xs text-slate-400">
                  ({tab.count})
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Expanded Posts List */}
              <div className="space-y-4 mt-4">
                {allUserPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} border border-slate-200 dark:border-slate-700 overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Post Header */}
                    <div className="flex items-center gap-3 p-3">
                      <img
                        src={PROFILE_DATA.avatar}
                        alt={PROFILE_DATA.name}
                        className={`w-10 h-10 ${BORDER_RADIUS.avatar} object-cover`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {PROFILE_DATA.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {post.timestamp || "Recently"}
                        </p>
                      </div>
                    </div>

                    {/* Post Caption */}
                    {post.caption && (
                      <p className="px-3 pb-2 text-sm text-slate-700 dark:text-slate-300">
                        {post.caption}
                      </p>
                    )}

                    {/* Post Image */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.caption || "Post"}
                        className="w-full object-cover max-h-125"
                      />
                    )}

                    {/* Post Actions */}
                    <div className="p-3 flex items-center gap-4 border-t border-slate-100 dark:border-slate-700">
                      <motion.button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 cursor-pointer ${post.isLiked
                            ? "text-rose-500"
                            : "text-slate-500 dark:text-slate-400 hover:text-rose-500"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart
                          className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""
                            }`}
                        />
                        <span className="text-sm font-medium">
                          {post.likes}
                        </span>
                      </motion.button>

                      <motion.button
                        onClick={() => handleCommentToggle(post.id)}
                        className={`flex items-center gap-1.5 cursor-pointer ${profilePostComments[post.id]
                            ? "text-blue-500"
                            : "text-slate-500 dark:text-slate-400 hover:text-blue-500"
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {post.comments}
                        </span>
                      </motion.button>
                    </div>

                    {/* Comments Section */}
                    <AnimatePresence>
                      {profilePostComments[post.id] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100 dark:border-slate-700 overflow-hidden"
                        >
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/50">
                            {/* Comments List */}
                            {profileComments[post.id]?.length > 0 && (
                              <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                                {profileComments[post.id].map(
                                  (comment, idx) => (
                                    <motion.div
                                      key={comment.id}
                                      className="flex gap-2"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                    >
                                      <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className={`w-8 h-8 ${BORDER_RADIUS.avatar} object-cover shrink-0`}
                                      />
                                      <div className={`flex-1 bg-white dark:bg-slate-700 ${BORDER_RADIUS.card} p-2.5 shadow-sm`}>
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                            {comment.user.name}
                                          </span>
                                          <span className="text-xs text-slate-400 dark:text-slate-500">
                                            {comment.timestamp}
                                          </span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm">
                                          {comment.content}
                                        </p>
                                      </div>
                                    </motion.div>
                                  ),
                                )}
                              </div>
                            )}

                            {/* Add Comment Input */}
                            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                              <img
                                src={PROFILE_DATA.avatar}
                                alt={PROFILE_DATA.name}
                                className={`w-8 h-8 ${BORDER_RADIUS.avatar} object-cover shrink-0`}
                              />
                              <div className="flex-1 flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  value={newComment[post.id] || ""}
                                  onChange={(e) =>
                                    setNewComment((prev) => ({
                                      ...prev,
                                      [post.id]: e.target.value,
                                    }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddComment(post.id);
                                    }
                                  }}
                                  className={`flex-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 ${BORDER_RADIUS.input} text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                />
                                <motion.button
                                  onClick={() => handleAddComment(post.id)}
                                  disabled={!newComment[post.id]?.trim()}
                                  className={`px-3 py-1.5 bg-orange-500 text-white ${BORDER_RADIUS.button} text-xs font-semibold hover:bg-orange-600 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Post
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-slate-800 ${BORDER_RADIUS.card} p-4 sm:p-6 border border-slate-200 dark:border-slate-700 mt-4`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                About Me
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Hey there! I'm {PROFILE_DATA.name}, a {PROFILE_DATA.profession}{" "}
                based in {PROFILE_DATA.location}. I'm passionate about creating
                meaningful digital experiences and connecting with like-minded
                individuals. When I'm not designing, you'll find me exploring
                nature, capturing moments through photography, or diving into a
                good book.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Work
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{PROFILE_DATA.profession}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Location
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{PROFILE_DATA.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Design",
                      "Photography",
                      "Travel",
                      "Technology",
                      "Music",
                      "Art",
                    ].map((interest) => (
                      <span
                        key={interest}
                        className={`px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ${BORDER_RADIUS.badge} text-xs font-medium`}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileTab;
