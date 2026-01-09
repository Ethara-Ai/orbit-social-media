import { useFeed } from "../../context/AppContext";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

const FeedTab = () => {
  // Only need posts from context - child components access their own data via hooks
  const { posts } = useFeed();

  return (
    <div className="max-w-2xl mx-auto w-full px-0 pb-1.5 overflow-x-hidden">
      {/* Create Post Section - Now includes header internally */}
      <CreatePost />

      {/* Posts List - PostCard uses hooks internally */}
      <div className="space-y-4 mt-4">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

export default FeedTab;
