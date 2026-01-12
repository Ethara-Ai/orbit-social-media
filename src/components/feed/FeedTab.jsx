import { useEffect, useRef } from 'react';
import { useFeed } from '../../context/AppContext';
import { useTab } from '../../context/providers/ui';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const FeedTab = () => {
  // Only need posts from context - child components access their own data via hooks
  const { posts } = useFeed();
  const { highlightedPostId, setHighlightedPostId } = useTab();
  const postRefs = useRef({});

  // Scroll to highlighted post when navigating from notifications
  useEffect(() => {
    if (highlightedPostId) {
      // Small delay to ensure the DOM is ready
      const timeoutId = setTimeout(() => {
        const postElement = postRefs.current[highlightedPostId];
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Clear the highlighted post after a delay for the highlight animation
        setTimeout(() => {
          setHighlightedPostId(null);
        }, 2000);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [highlightedPostId, setHighlightedPostId]);

  return (
    <div className="max-w-2xl mx-auto w-full px-0 pb-1.5 overflow-x-hidden">
      {/* Create Post Section - Now includes header internally */}
      <CreatePost />

      {/* Posts List - PostCard uses hooks internally */}
      <div className="space-y-4 mt-4">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            ref={(el) => (postRefs.current[post.id] = el)}
            isHighlighted={highlightedPostId === post.id}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedTab;
