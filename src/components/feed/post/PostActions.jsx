// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from '../../icons';

const PostActions = ({ postId, likes, commentsCount, isLiked, onLike, onComment }) => {
  const handleLike = (e) => {
    e.stopPropagation();
    onLike(postId);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    onComment(postId);
  };

  return (
    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4" role="group" aria-label="Post actions">
        <motion.button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 transition-colors cursor-pointer ${
            isLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isLiked ? `Unlike post, ${likes} likes` : `Like post, ${likes} likes`}
          aria-pressed={isLiked}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-medium">{likes}</span>
        </motion.button>

        <motion.button
          onClick={handleComment}
          className="flex items-center gap-1 sm:gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`View comments, ${commentsCount} comments`}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-medium">{commentsCount}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default PostActions;
