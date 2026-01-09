import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hash } from '../icons';
import EmptyState from '../common/EmptyState';
import CategoryPills from './CategoryPills';
import ExploreHeader from './ExploreHeader';
import FeaturedSection from './FeaturedSection';
import RegularPostsGrid from './RegularPostsGrid';
import TheaterModal from './modal/TheaterModal';
import { generateExplorePostComments } from '../../data/mockData';
import { useExplore, useUI } from '../../context/AppContext';

const ExploreTab = () => {
  // Access explore state and actions directly from context
  const {
    explorePosts,
    exploreCategories,
    activeExploreCategory,
    setActiveExploreCategory,
    handleExploreLike,
  } = useExplore();

  // Access UI state for theater mode
  const { setIsTheaterModeOpen } = useUI();

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState({});
  const [showComments, setShowComments] = useState(false);

  // Get the selected post from explorePosts to keep it in sync
  const selectedPost = selectedPostId ? explorePosts.find((p) => p.id === selectedPostId) : null;

  // Manage body overflow with proper cleanup to prevent memory leaks
  useEffect(() => {
    if (selectedPostId) {
      document.body.style.overflow = 'hidden';
      setIsTheaterModeOpen(true);
    } else {
      document.body.style.overflow = 'unset';
      setIsTheaterModeOpen(false);
    }

    // Cleanup function ensures overflow is restored if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPostId, setIsTheaterModeOpen]);

  const filteredExplorePosts = activeExploreCategory
    ? explorePosts.filter((post) => {
        const category = exploreCategories.find((c) => c.id === activeExploreCategory);
        return category && post.category === category.name;
      })
    : explorePosts;

  const handleOpenPost = (post) => {
    setSelectedPostId(post.id);
    setShowComments(false);
    // Initialize comments for this post if not already done
    if (!postComments[post.id]) {
      setPostComments((prev) => ({
        ...prev,
        [post.id]: generateExplorePostComments(post.id, post.user.name),
      }));
    }
  };

  const handleClosePost = () => {
    setSelectedPostId(null);
    setCommentText('');
    setShowComments(false);
  };

  const handleLike = () => {
    if (selectedPostId) {
      handleExploreLike(selectedPostId);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPostId) return;

    const newComment = {
      id: `c-new-${Date.now()}`,
      user: {
        name: 'jordan_mitchell',
        avatar:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
      },
      text: commentText,
      likes: 0,
      time: 'now',
    };

    setPostComments((prev) => ({
      ...prev,
      [selectedPostId]: [newComment, ...(prev[selectedPostId] || [])],
    }));
    setCommentText('');
  };

  // Get featured posts (popular ones)
  const featuredPosts = filteredExplorePosts.filter((p) => p.isPopular).slice(0, 2);
  const regularPosts = filteredExplorePosts.filter((p) => !featuredPosts.includes(p));

  const currentComments = selectedPostId ? postComments[selectedPostId] || [] : [];

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <ExploreHeader />

      {/* Category Pills */}
      <CategoryPills
        categories={exploreCategories}
        activeCategory={activeExploreCategory}
        setActiveCategory={setActiveExploreCategory}
      />

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <FeaturedSection posts={featuredPosts} onPostClick={handleOpenPost} />
      )}

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <RegularPostsGrid posts={regularPosts} onPostClick={handleOpenPost} />
      )}

      {/* Empty State */}
      {filteredExplorePosts.length === 0 && (
        <EmptyState
          icon={Hash}
          title="No posts found in this category"
          description="Try selecting a different category"
        />
      )}

      {/* Theater Mode Modal */}
      <AnimatePresence>
        {selectedPost && (
          <TheaterModal
            selectedPost={selectedPost}
            onClose={handleClosePost}
            onLike={handleLike}
            showComments={showComments}
            setShowComments={setShowComments}
            currentComments={currentComments}
            commentText={commentText}
            setCommentText={setCommentText}
            onAddComment={handleAddComment}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreTab;
