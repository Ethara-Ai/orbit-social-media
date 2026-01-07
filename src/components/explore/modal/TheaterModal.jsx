import { createPortal } from "react-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Fire, Heart, MessageCircle } from "../../icons";
import Avatar from "../../common/Avatar";
import CommentsPanel from "./CommentsPanel";

const TheaterModal = ({
  selectedPost,
  onClose,
  onLike,
  showComments,
  setShowComments,
  currentComments,
  commentText,
  setCommentText,
  onAddComment,
}) => {
  if (!selectedPost) return null;

  // Use portal to render modal at document.body level
  // This escapes any stacking context issues from parent containers
  return createPortal(
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Main Content Container */}
      <div className="relative h-full flex flex-col">
        {/* Top Navigation Bar */}
        <TheaterHeader selectedPost={selectedPost} onClose={onClose} />

        {/* Content Area with Comments */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Post Content - shifts left when comments open */}
          <motion.div
            className="flex-1 flex flex-col min-w-0"
            animate={{
              paddingRight: showComments ? "28rem" : 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <TheaterContent selectedPost={selectedPost} />

            {/* Bottom Action Bar */}
            <TheaterActionBar
              selectedPost={selectedPost}
              onLike={onLike}
              showComments={showComments}
              setShowComments={setShowComments}
              commentsCount={currentComments.length}
            />
          </motion.div>

          {/* Comments Panel - slides in from right */}
          <AnimatePresence mode="wait">
            {showComments && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <CommentsPanel
                  comments={currentComments}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  onAddComment={onAddComment}
                  onClose={() => setShowComments(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
};

const TheaterHeader = ({ selectedPost, onClose }) => {
  return (
    <motion.div
      className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <button
        onClick={onClose}
        className="flex items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-xs sm:text-sm font-medium">Back</span>
      </button>

      {/* Author Info - Centered */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar
          src={selectedPost.user.avatar}
          alt={selectedPost.user.name}
          size="sm"
          ring={true}
          ringColor="orange"
          className="w-7 h-7 sm:w-9 sm:h-9"
        />
        <div className="hidden xs:block sm:block">
          <p className="text-white font-semibold text-xs sm:text-sm">
            {selectedPost.user.name}
          </p>
          <p className="text-white/50 text-[10px] sm:text-xs">
            {selectedPost.user.profession}
          </p>
        </div>
      </div>

      {/* Category Badge */}
      <div className="flex items-center gap-1 sm:gap-2">
        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-full text-white/70 text-[10px] sm:text-xs font-medium">
          {selectedPost.category}
        </span>
        {selectedPost.isPopular && (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-500/20 text-orange-400 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1">
            <Fire className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Trending</span>
          </span>
        )}
      </div>
    </motion.div>
  );
};

const TheaterContent = ({ selectedPost }) => {
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  return (
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
            alt={selectedPost.title}
            className="w-full max-h-[50vh] sm:max-h-[65vh] object-contain bg-black"
            onError={handleImageError}
          />

          {/* Gradient Overlay for Title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-6">
            <h2 className="text-white text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
              {selectedPost.title}
            </h2>
            <p className="text-white/70 text-xs sm:text-sm line-clamp-2">
              {selectedPost.content ||
                `Explore this amazing content about ${selectedPost.category.toLowerCase()}. Shared by ${selectedPost.user.name} for the community.`}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TheaterActionBar = ({
  selectedPost,
  onLike,
  showComments,
  setShowComments,
  commentsCount,
}) => {
  return (
    <motion.div
      className="bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Like Button */}
          <ActionButton
            onClick={onLike}
            isActive={selectedPost.isLiked}
            activeClassName="bg-rose-500 text-white"
            icon={Heart}
            count={selectedPost.likes}
            fillIcon={selectedPost.isLiked}
          />

          {/* Comment Button */}
          <ActionButton
            onClick={() => setShowComments(!showComments)}
            isActive={showComments}
            activeClassName="bg-blue-500 text-white"
            icon={MessageCircle}
            count={commentsCount}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton = ({
  onClick,
  isActive,
  activeClassName = "",
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  count,
  label,
  fillIcon = false,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all ${
        isActive ? activeClassName : "bg-white/10 text-white hover:bg-white/20"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon
        className={`w-4 h-4 sm:w-5 sm:h-5 ${fillIcon ? "fill-current" : ""}`}
      />
      <span className="font-medium text-sm sm:text-base">
        {count !== undefined ? count.toLocaleString() : label}
      </span>
    </motion.button>
  );
};

export { TheaterHeader, TheaterContent, TheaterActionBar, ActionButton };
export default TheaterModal;
