import { useFeed } from "../../context/AppContext";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

const FeedTab = () => {
  // Only need posts from context - child components access their own data via hooks
  const { posts } = useFeed();

  return (
    <div className="max-w-2xl mx-auto w-full px-0 max-w-[100vw] overflow-x-hidden">
      {/* Feed Header */}
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white transition-colors">
          Your Orbit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 transition-colors">
          See what's happening in your network
        </p>
      </div>

      {/* Create Post Section - uses hooks internally */}
      <CreatePost />

      {/* Posts List - PostCard uses hooks internally */}
      <div className="space-y-3 sm:space-y-4">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FeedTab;
