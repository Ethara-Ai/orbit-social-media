import { Fire } from "../icons";
import FeaturedPostCard from "./FeaturedPostCard";

const FeaturedSection = ({ posts, onPostClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
        <Fire className="w-5 h-5 text-orange-500" />
        Trending Now
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, index) => (
          <FeaturedPostCard
            key={post.id}
            post={post}
            index={index}
            onClick={onPostClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;
