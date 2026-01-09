// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { usePostCard } from "../../hooks";
import PostHeader from "./post/PostHeader";
import PostContent from "./post/PostContent";
import PostActions from "./post/PostActions";
import PostComments from "./post/PostComments";

const PostCard = ({ post, index }) => {
  // Use facade hook to access all needed data and actions
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
      data-post-id={post.id}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden max-w-[100vw] transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
      }}
      whileHover={{
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        transition: { duration: 0.2 },
      }}
      onClick={() => handlePostClick(post.id)}
    >
      <PostHeader user={post.user} timestamp={post.timestamp} />

      <PostContent content={post.content} image={post.image} />

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
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700 cursor-default transition-colors"
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
};

export default PostCard;
