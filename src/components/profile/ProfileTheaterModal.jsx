import { createPortal } from 'react-dom';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, MessageCircle, X } from '../icons';
import Avatar from '../common/Avatar';
import { BORDER_RADIUS, PROFILE_DATA } from '../../utils/constants';

const ProfileTheaterModal = ({
  selectedPost,
  onClose,
  onLike,
  comments,
  onAddComment,
  showComments: initialShowComments = false,
  currentUserAvatar,
}) => {
  const [showComments, setShowComments] = useState(initialShowComments);
  const [commentText, setCommentText] = useState('');

  if (!selectedPost) return null;

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(selectedPost.id, commentText);
      setCommentText('');
    }
  };

  const postComments = comments[selectedPost.id] || [];

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Main Content Container */}
      <div className="relative h-full flex flex-col">
        {/* Top Navigation Bar */}
        <motion.div
          className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={onClose}
            className="flex items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Back</span>
          </button>

          {/* Author Info - Centered */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar
              src={PROFILE_DATA.avatar}
              alt={PROFILE_DATA.name}
              size="sm"
              ring={true}
              ringColor="orange"
              className="w-7 h-7 sm:w-9 sm:h-9"
            />
            <div className="block">
              <p className="text-white font-semibold text-xs sm:text-sm">{PROFILE_DATA.name}</p>
              <p className="text-white/50 text-[10px] sm:text-xs">{PROFILE_DATA.profession}</p>
            </div>
          </div>

          {/* Placeholder for symmetry */}
          <div className="w-16" />
        </motion.div>

        {/* Content Area with Comments */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Post Content - shifts left when comments open */}
          <motion.div
            className="flex-1 flex flex-col min-w-0"
            animate={{
              paddingRight: showComments ? '28rem' : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Image Content */}
            <div className="flex-1 flex items-center justify-center px-3 sm:px-6">
              <motion.div
                className="relative w-full max-w-4xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Main Image Card */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.caption}
                    className="w-full max-h-[50vh] sm:max-h-[65vh] object-contain bg-black"
                  />

                  {/* Gradient Overlay for Caption */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-6">
                    <p className="text-white text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                      {selectedPost.caption}
                    </p>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {selectedPost.timestamp || 'Recently'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Action Bar */}
            <motion.div
              className="bg-gradient-to-t from-black via-black/95 to-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {/* Like Button */}
                  <motion.button
                    onClick={() => onLike(selectedPost.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 ${BORDER_RADIUS.button} transition-all cursor-pointer ${
                      selectedPost.isLiked
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedPost.isLiked ? 'fill-current' : ''}`}
                    />
                    <span className="font-medium text-sm sm:text-base">
                      {selectedPost.likes?.toLocaleString()}
                    </span>
                  </motion.button>

                  {/* Comment Button */}
                  <motion.button
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 ${BORDER_RADIUS.button} transition-all cursor-pointer ${
                      showComments
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">
                      {postComments.length || selectedPost.comments}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Comments Panel - slides in from right */}
          <AnimatePresence mode="wait">
            {showComments && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-800 shadow-2xl flex flex-col"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Comments Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-neutral-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">Comments</h3>
                  <button
                    onClick={() => setShowComments(false)}
                    className={`p-1 hover:bg-slate-100 dark:hover:bg-neutral-700 ${BORDER_RADIUS.button} transition-colors cursor-pointer`}
                  >
                    <X className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-slate-50 dark:bg-neutral-800/50">
                  {postComments.length > 0 ? (
                    postComments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
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
                          className={`flex-1 min-w-0 bg-white dark:bg-neutral-700 ${BORDER_RADIUS.commentBubble} p-2 sm:p-3 shadow-xs`}
                        >
                          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                              {comment.user.name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 dark:text-neutral-500 shrink-0">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-neutral-300 text-xs sm:text-sm">
                            {comment.content}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400 dark:text-neutral-500 text-sm">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="shrink-0 p-4 border-t border-slate-100 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Avatar
                      src={currentUserAvatar || PROFILE_DATA.avatar}
                      alt="You"
                      size="sm"
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        className={`flex-1 min-w-0 px-3 sm:px-4 py-2 bg-white dark:bg-neutral-700 border border-slate-200 dark:border-neutral-600 ${BORDER_RADIUS.input} text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500`}
                      />
                      <motion.button
                        onClick={handleAddComment}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default ProfileTheaterModal;
