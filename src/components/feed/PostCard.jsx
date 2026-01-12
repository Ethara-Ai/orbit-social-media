import { memo, forwardRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { usePostCard } from '../../hooks';
import { BORDER_RADIUS } from '../../utils/constants';
import PostHeader from './post/PostHeader';
import PostContent from './post/PostContent';
import PostActions from './post/PostActions';
import PostComments from './post/PostComments';

const PostCard = memo(
  forwardRef(function PostCard({ post, index, isHighlighted = false }, ref) {
    // Access feed state and actions directly from context
    const {
      comments,
      showComments,
      newComment,
      setNewComment,
      handleLike,
      handleComment,
      handleAddComment,
      handlePostClick,
      currentUser,
      currentUserAvatar,
    } = usePostCard();

    const isCommentsVisible = showComments.includes(post.id);

    return (
      <motion.article
        ref={ref}
        data-post-id={post.id}
        className={`bg-white dark:bg-neutral-800 ${BORDER_RADIUS.card} shadow-sm border overflow-hidden max-w-[100vw] transition-all duration-300 ${
          isHighlighted
            ? 'border-orange-400 dark:border-orange-500 ring-2 ring-orange-400/50 dark:ring-orange-500/50'
            : 'border-slate-200 dark:border-neutral-700'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isHighlighted ? [1, 1.02, 1] : 1,
        }}
        transition={{
          delay: index * 0.1,
          duration: 0.4,
          scale: { duration: 0.5, repeat: isHighlighted ? 2 : 0 },
        }}
        whileHover={{
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          transition: { duration: 0.2 },
        }}
        onClick={() => handlePostClick(post.id)}
      >
        <PostHeader user={post.user} timestamp={post.timestamp} />

        <PostContent content={post.content} image={post.image} images={post.images} />

        <PostActions
          postId={post.id}
          likes={post.likes}
          commentsCount={post.comments}
          isLiked={post.isLiked}
          onLike={handleLike}
          onComment={handleComment}
        />

        {/* Comments Section */}
        <AnimatePresence>
          {isCommentsVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-100 dark:border-neutral-700 cursor-default transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <PostComments
                postId={post.id}
                comments={comments}
                currentUser={currentUser}
                currentUserAvatar={currentUserAvatar}
                newComment={newComment}
                setNewComment={setNewComment}
                onAddComment={handleAddComment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    );
  })
);

PostCard.propTypes = {
  /** Post data object containing all post information */
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }).isRequired,
    content: PropTypes.string,
    image: PropTypes.string,
    likes: PropTypes.number,
    comments: PropTypes.number,
    shares: PropTypes.number,
    timestamp: PropTypes.string,
    isLiked: PropTypes.bool,
    category: PropTypes.string,
  }).isRequired,
  /** Index of the post in the list, used for staggered animations */
  index: PropTypes.number,
  /** Whether the post is highlighted (e.g., from notification click) */
  isHighlighted: PropTypes.bool,
};

export default PostCard;
