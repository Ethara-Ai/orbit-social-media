import { useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Avatar from "../../common/Avatar";
import { BORDER_RADIUS } from "../../../utils/constants";

const PostComments = ({
  postId,
  comments,
  currentUser,
  currentUserAvatar,
  newComment,
  setNewComment,
  onAddComment,
}) => {
  const postComments = comments.filter((comment) => comment.postId === postId);
  const commentsContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: commentsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [postComments]);

  const handleCommentChange = (e) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: e.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddComment(postId);
    }
  };

  const handleSubmit = () => {
    onAddComment(postId);
  };

  return (
    <div className="p-2 sm:p-4 bg-slate-50 dark:bg-slate-800/50 transition-colors">
      {/* Comments List */}
      <div
        ref={commentsContainerRef}
        className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar"
      >
        {postComments.map((comment, idx) => (
          <CommentItem key={comment.id} comment={comment} index={idx} />
        ))}
      </div>

      {/* Add Comment */}
      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700 transition-colors">
        <Avatar
          src={currentUserAvatar}
          alt={currentUser.name}
          size="sm"
          className="w-6 h-6 sm:w-8 sm:h-8 shrink-0"
        />
        <div className="flex-1 min-w-0 flex gap-1.5 sm:gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment[postId] || ""}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 ${BORDER_RADIUS.input} text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors`}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={!newComment[postId]?.trim()}
            className={`bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 ${BORDER_RADIUS.button} font-medium text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 transition-colors shrink-0`}
            whileHover={{
              scale: newComment[postId]?.trim() ? 1.02 : 1,
            }}
            whileTap={{
              scale: newComment[postId]?.trim() ? 0.98 : 1,
            }}
          >
            Post
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({ comment, index }) => {
  return (
    <motion.div
      className="flex gap-2 sm:gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Avatar
        src={comment.user.avatar}
        alt={comment.user.name}
        size="sm"
        className="w-6 h-6 sm:w-8 sm:h-8 shrink-0"
      />
      <div
        className={`flex-1 min-w-0 bg-white dark:bg-slate-700 ${BORDER_RADIUS.commentBubble} p-2 sm:p-3 shadow-xs transition-colors`}
      >
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
          <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate transition-colors">
            {comment.user.name}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 shrink-0 transition-colors">
            {comment.timestamp}
          </span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm transition-colors">
          {comment.content}
        </p>
      </div>
    </motion.div>
  );
};

export default PostComments;
