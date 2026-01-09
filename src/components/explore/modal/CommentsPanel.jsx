// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X } from '../../icons';
import Avatar from '../../common/Avatar';
import { BORDER_RADIUS } from '../../../utils/constants';

const CommentsPanel = ({
  comments,
  commentText,
  setCommentText,
  onAddComment,
  onClose,
  currentUserAvatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face',
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddComment();
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-neutral-800 transition-colors duration-300">
      {/* Comments Header */}
      <CommentsPanelHeader onClose={onClose} />

      {/* Comments List */}
      <CommentsList comments={comments} />

      {/* Comment Input */}
      <CommentInput
        commentText={commentText}
        setCommentText={setCommentText}
        onAddComment={onAddComment}
        onKeyDown={handleKeyDown}
        currentUserAvatar={currentUserAvatar}
      />
    </div>
  );
};

const CommentsPanelHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-neutral-700 transition-colors">
      <h3 className="font-bold text-slate-900 dark:text-white transition-colors">Comments</h3>
      <button
        onClick={onClose}
        className={`p-1 hover:bg-slate-100 dark:hover:bg-neutral-700 ${BORDER_RADIUS.button} transition-colors cursor-pointer`}
      >
        <X className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const CommentsList = ({ comments }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-neutral-800/50 transition-colors">
      {comments.map((comment, index) => (
        <CommentItem key={comment.id} comment={comment} index={index} />
      ))}
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
        className={`flex-1 min-w-0 bg-white dark:bg-neutral-700 ${BORDER_RADIUS.commentBubble} p-2 sm:p-3 shadow-xs transition-colors`}
      >
        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
          <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate transition-colors">
            {comment.user.name}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 dark:text-neutral-500 shrink-0 transition-colors">
            {comment.time}
          </span>
        </div>
        <p className="text-slate-700 dark:text-neutral-300 text-xs sm:text-sm transition-colors">
          {comment.text}
        </p>
      </div>
    </motion.div>
  );
};

const CommentInput = ({
  commentText,
  setCommentText,
  onAddComment,
  onKeyDown,
  currentUserAvatar,
}) => {
  return (
    <div className="shrink-0 p-4 border-t border-slate-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar src={currentUserAvatar} alt="You" size="sm" className="shrink-0" />
        <div className="flex-1 min-w-0 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={onKeyDown}
            className={`flex-1 min-w-0 px-3 sm:px-4 py-2 bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 ${BORDER_RADIUS.input} text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors`}
          />
          <motion.button
            onClick={onAddComment}
            disabled={!commentText.trim()}
            className={`shrink-0 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 ${BORDER_RADIUS.button} font-medium text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 transition-colors whitespace-nowrap`}
            whileHover={{
              scale: commentText.trim() ? 1.02 : 1,
            }}
            whileTap={{
              scale: commentText.trim() ? 0.98 : 1,
            }}
          >
            Post
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPanel;
