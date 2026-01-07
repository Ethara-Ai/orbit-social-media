import { motion } from "framer-motion";
import { Heart, MessageCircle } from "../../icons";

const PostActions = ({
  postId,
  likes,
  commentsCount,
  isLiked,
  onLike,
  onComment,
}) => {
  const handleLike = (e) => {
    e.stopPropagation();
    onLike(postId);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    onComment(postId);
  };

  return (
    <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-slate-100 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-4 sm:gap-6">
        <motion.button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 cursor-pointer transition-colors ${
            isLiked
              ? "text-rose-500"
              : "text-slate-500 dark:text-slate-400 hover:text-rose-500"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
          />
          <span className="text-xs sm:text-sm font-medium">{likes}</span>
        </motion.button>

        <motion.button
          onClick={handleComment}
          className="flex items-center gap-1 sm:gap-2 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">
            {commentsCount}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default PostActions;
