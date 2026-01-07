import { useFeed } from "../../context/AppContext";
import { useUser } from "../../context/AppContext";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

const FeedTab = () => {
  // Access feed state and actions directly from context
  const {
    posts,
    comments,
    showComments,
    newComment,
    setNewComment,
    newPostContent,
    setNewPostContent,
    selectedImage,
    setSelectedImage,
    handleLike,
    handleComment,
    handleAddComment,
    handlePostClick,
    handleCreatePost,
    handleImageUpload,
  } = useFeed();

  // Access user data from context
  const { currentUser, currentUserAvatar } = useUser();

  return (
    <div className="max-w-2xl mx-auto w-full px-0 max-w-[100vw] overflow-x-hidden">
      {/* Feed Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">
          Your Orbit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 transition-colors">
          See what's happening in your network
        </p>
      </div>

      {/* Create Post Section */}
      <CreatePost
        currentUser={currentUser}
        currentUserAvatar={currentUserAvatar}
        newPostContent={newPostContent}
        setNewPostContent={setNewPostContent}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onCreatePost={handleCreatePost}
        onImageUpload={handleImageUpload}
      />

      {/* Posts List */}
      <div className="space-y-3 sm:space-y-4">
        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={index}
            currentUser={currentUser}
            currentUserAvatar={currentUserAvatar}
            comments={comments}
            showComments={showComments}
            newComment={newComment}
            setNewComment={setNewComment}
            onLike={handleLike}
            onComment={handleComment}
            onAddComment={handleAddComment}
            onPostClick={handlePostClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedTab;
