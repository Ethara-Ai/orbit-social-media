import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useFeed } from '../../context/AppContext';
import { useTab } from '../../context/providers/ui';
import { Heart, MessageCircle, Briefcase, MapPin, Share2, ChevronLeft } from '../icons';
import { PROFILE_DATA, INITIAL_PROFILE_POSTS, BORDER_RADIUS, TABS } from '../../utils/constants';
import FollowersModal from './FollowersModal';
import ProfileTheaterModal from './ProfileTheaterModal';

// Mock comments for profile posts
const profilePostMockComments = {
  p1: [
    {
      id: 'pc1',
      user: {
        name: 'Zara Chen',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Absolutely breathtaking view! 😍 Where was this taken?',
      timestamp: '2 hours ago',
    },
    {
      id: 'pc2',
      user: {
        name: 'Lucas Rivera',
        avatar:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      },
      content: 'The mountains are calling! Great shot 🏔️',
      timestamp: '1 hour ago',
    },
  ],
  p2: [
    {
      id: 'pc3',
      user: {
        name: 'Lucas Rivera',
        avatar:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      },
      content: 'This is absolutely stunning! The colors are perfect ✨',
      timestamp: '10 min ago',
    },
    {
      id: 'pc4',
      user: {
        name: 'Mia Tanaka',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Such stunning colors! What camera did you use?',
      timestamp: '2 hours ago',
    },
    {
      id: 'pc5',
      user: {
        name: 'Zara Chen',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      },
      content: 'This should be on a postcard! Beautiful! 🌅',
      timestamp: '3 hours ago',
    },
  ],
  p3: [
    {
      id: 'pc6',
      user: {
        name: 'Mia Tanaka',
        avatar:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      },
      content:
        '@jordanm this reminds me of our conversation about travel photography! You have such a great eye for landscapes 🌄',
      timestamp: '18 min ago',
    },
    {
      id: 'pc6b',
      user: {
        name: 'Nathan Park',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Adventure awaits! Love the composition 🌄',
      timestamp: '5 hours ago',
    },
  ],
  p4: [
    {
      id: 'pc7',
      user: {
        name: 'Nathan Okonkwo',
        avatar:
          'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Nature therapy at its finest 🌲💚 This is incredible!',
      timestamp: '35 min ago',
    },
    {
      id: 'pc8',
      user: {
        name: 'Zara Chen',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      },
      content: 'This makes me want to go hiking!',
      timestamp: '3 hours ago',
    },
  ],
  p5: [
    {
      id: 'pc9',
      user: {
        name: 'Elena Volkov',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
      content:
        'Hey @jordanm, you should check out the waterfalls in Iceland! This shot is amazing 💧',
      timestamp: '1 hour ago',
    },
    {
      id: 'pc9b',
      user: {
        name: 'Emma Watson',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
      content: 'The sound of waterfalls is so calming 💧',
      timestamp: '6 hours ago',
    },
  ],
  p6: [
    {
      id: 'pc10',
      user: {
        name: 'Kai Anderson',
        avatar:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Moody vibes! Perfect atmosphere 🌫️ Love this shot!',
      timestamp: '2 hours ago',
    },
    {
      id: 'pc11',
      user: {
        name: 'Elena Volkov',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
      content: 'Early mornings are worth it for views like this!',
      timestamp: '5 hours ago',
    },
  ],
};

const ProfileTab = () => {
  const { currentUser } = useUser();
  const { posts: feedPosts } = useFeed();
  const { pendingProfilePost, setPendingProfilePost, setActiveTab: setActiveMainTab } = useTab();

  const [activeProfileTab, setActiveProfileTab] = useState('posts');
  const postRefs = useRef({});
  const [profilePosts, setProfilePosts] = useState(INITIAL_PROFILE_POSTS);
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [profileComments, setProfileComments] = useState(profilePostMockComments);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState('followers');
  // Initialize state directly from pendingProfilePost to prevent flash
  const [selectedPostId, setSelectedPostId] = useState(() => pendingProfilePost?.postId || null);
  const [openCommentsOnModal, setOpenCommentsOnModal] = useState(
    () => pendingProfilePost?.openComments || false
  );
  const [cameFromNotifications, setCameFromNotifications] = useState(
    () => pendingProfilePost?.fromNotifications || false
  );

  // Get user's posts from feed (posts created by current user)
  const userFeedPosts = feedPosts.filter((post) => post.user.id === currentUser.id);

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

  // Derive selectedPost from profilePosts to keep it in sync (for like button)
  const selectedPost = selectedPostId
    ? allUserPosts.find((p) => p.id === selectedPostId) || null
    : null;

  // Handle pendingProfilePost changes and clear after processing
  // Using a single effect to avoid cascading renders
  useEffect(() => {
    if (pendingProfilePost) {
      // Only update state if this is a different post than currently selected
      if (selectedPostId !== pendingProfilePost.postId) {
        // Use a microtask to batch the state updates and avoid the eslint warning
        // about setting state synchronously in effects
        queueMicrotask(() => {
          setSelectedPostId(pendingProfilePost.postId);
          setOpenCommentsOnModal(pendingProfilePost.openComments || false);
          setCameFromNotifications(pendingProfilePost.fromNotifications || false);
        });
      }
      // Clear pendingProfilePost after processing
      setPendingProfilePost(null);
    }
  }, [pendingProfilePost, selectedPostId, setPendingProfilePost]);

  const stats = {
    posts: allUserPosts.length,
    followers: PROFILE_DATA.followers,
    following: PROFILE_DATA.following,
  };

  const profileTabs = [
    { id: 'posts', label: 'Posts', count: allUserPosts.length },
    { id: 'about', label: 'About', count: null },
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
          : post
      )
    );
  };

  // Handle share profile
  const handleShareProfile = () => {
    const profileUrl = `https://orbit.social/${PROFILE_DATA.username.replace('@', '')}`;
    navigator.clipboard.writeText(profileUrl);
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 2000);
  };

  // Handle opening followers/following modal
  const handleOpenFollowersModal = (tab) => {
    setFollowersModalTab(tab);
    setShowFollowersModal(true);
  };

  // Handle opening post in theater modal
  const handleOpenPost = (post) => {
    setSelectedPostId(post.id);
    setOpenCommentsOnModal(false);
    setCameFromNotifications(false);
  };

  // Handle closing theater modal
  const handleCloseTheaterModal = () => {
    // If user came from notifications, navigate back to notifications tab
    if (cameFromNotifications) {
      setActiveMainTab(TABS.NOTIFICATIONS);
    }
    setSelectedPostId(null);
    setOpenCommentsOnModal(false);
    setCameFromNotifications(false);
  };

  // Handle adding comment from theater modal
  const handleTheaterAddComment = (postId, commentText) => {
    if (!commentText?.trim()) return;

    const newCommentObj = {
      id: `pc-${Date.now()}`,
      user: {
        name: PROFILE_DATA.name,
        avatar: PROFILE_DATA.avatar,
      },
      content: commentText,
      timestamp: 'Just now',
    };

    setProfileComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj],
    }));

    setProfilePosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, comments: post.comments + 1 } : post))
    );
  };

  return (
    <div
      className={`max-w-4xl mx-auto w-full pb-8 bg-white dark:bg-neutral-900 ${BORDER_RADIUS.card}`}
    >
      {/* Followers/Following Modal */}
      <AnimatePresence>
        {showFollowersModal && (
          <FollowersModal
            isOpen={showFollowersModal}
            onClose={() => setShowFollowersModal(false)}
            initialTab={followersModalTab}
          />
        )}
      </AnimatePresence>

      {/* Profile Theater Modal */}
      <AnimatePresence>
        {selectedPost && (
          <ProfileTheaterModal
            selectedPost={selectedPost}
            onClose={handleCloseTheaterModal}
            onLike={handleLike}
            comments={profileComments}
            onAddComment={handleTheaterAddComment}
            showComments={openCommentsOnModal}
            currentUserAvatar={PROFILE_DATA.avatar}
          />
        )}
      </AnimatePresence>

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
          <img src={PROFILE_DATA.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

          {/* Back to Home Button */}
          <motion.button
            onClick={() => setActiveMainTab(TABS.FEED)}
            className={`absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-0.5 px-2 py-1 bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-md ${BORDER_RADIUS.button} text-white text-xs font-medium transition-all cursor-pointer`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Home</span>
          </motion.button>
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
              className={`w-24 h-24 sm:w-32 sm:h-32 ${BORDER_RADIUS.avatar} border-4 border-white dark:border-neutral-900 object-cover shadow-lg`}
            />
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 ${BORDER_RADIUS.badge} border-2 border-white dark:border-neutral-900`}
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
            <p className="text-sm text-slate-500 dark:text-neutral-400">{PROFILE_DATA.username}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600 dark:text-neutral-400">
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
              className={`flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-neutral-700 ${BORDER_RADIUS.cardSmall} text-sm font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer`}
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
          className="mt-4 text-sm text-slate-600 dark:text-neutral-400 max-w-2xl"
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
            <span className="text-sm sm:text-base text-slate-600 dark:text-neutral-400">Posts</span>
          </div>
          <motion.button
            onClick={() => handleOpenFollowersModal('followers')}
            className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-[16px] font-bold text-slate-900 dark:text-white">
              {stats.followers}
            </span>
            <span className="text-sm sm:text-base text-slate-600 dark:text-neutral-400">
              Followers
            </span>
          </motion.button>
          <motion.button
            onClick={() => handleOpenFollowersModal('following')}
            className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-[16px] font-bold text-slate-900 dark:text-white">
              {stats.following}
            </span>
            <span className="text-sm sm:text-base text-slate-600 dark:text-neutral-400">
              Following
            </span>
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-slate-200 dark:border-neutral-700">
          {profileTabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveProfileTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer ${
                activeProfileTab === tab.id
                  ? 'text-orange-500'
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1 text-xs text-slate-400">({tab.count})</span>
              )}
              {activeProfileTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                  layoutId="activeProfileTab"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeProfileTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Expanded Posts List */}
              <div className="space-y-4 mt-4">
                {allUserPosts.map((post, index) => {
                  return (
                    <motion.div
                      key={post.id}
                      ref={(el) => (postRefs.current[post.id] = el)}
                      className={`bg-white dark:bg-neutral-800 ${BORDER_RADIUS.card} border border-slate-200 dark:border-neutral-700 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleOpenPost(post)}
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
                          <p className="text-xs text-slate-500 dark:text-neutral-400">
                            {post.timestamp || 'Recently'}
                          </p>
                        </div>
                      </div>

                      {/* Post Caption */}
                      {post.caption && (
                        <p className="px-3 pb-2 text-sm text-slate-700 dark:text-neutral-300">
                          {post.caption}
                        </p>
                      )}

                      {/* Post Image */}
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.caption || 'Post'}
                          className="w-full object-cover max-h-125"
                        />
                      )}

                      {/* Post Actions */}
                      <div
                        className="p-3 flex items-center gap-4 border-t border-slate-100 dark:border-neutral-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className={`flex items-center gap-1.5 cursor-pointer ${
                            post.isLiked
                              ? 'text-rose-500'
                              : 'text-slate-500 dark:text-neutral-400 hover:text-rose-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </motion.button>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPost(post);
                            setOpenCommentsOnModal(true);
                          }}
                          className="flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-neutral-400 hover:text-blue-500"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {profileComments[post.id]?.length || post.comments}
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeProfileTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-neutral-800 ${BORDER_RADIUS.card} p-4 sm:p-6 border border-slate-200 dark:border-neutral-700 mt-4`}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                About Me
              </h3>
              <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-6">
                Hey there! I'm {PROFILE_DATA.name}, a {PROFILE_DATA.profession} based in{' '}
                {PROFILE_DATA.location}. I'm passionate about creating meaningful digital
                experiences and connecting with like-minded individuals. When I'm not designing,
                you'll find me exploring nature, capturing moments through photography, or diving
                into a good book.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Work
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-neutral-400">
                    <Briefcase className="w-4 h-4" />
                    <span>{PROFILE_DATA.profession}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Location
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-neutral-400">
                    <MapPin className="w-4 h-4" />
                    <span>{PROFILE_DATA.location}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Design', 'Photography', 'Travel', 'Technology', 'Music', 'Art'].map(
                      (interest) => (
                        <span
                          key={interest}
                          className={`px-3 py-1 bg-slate-100 dark:bg-neutral-700 text-slate-700 dark:text-neutral-300 ${BORDER_RADIUS.badge} text-xs font-medium`}
                        >
                          {interest}
                        </span>
                      )
                    )}
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
