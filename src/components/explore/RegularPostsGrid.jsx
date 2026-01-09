import ExplorePostCard from './ExplorePostCard';

const RegularPostsGrid = ({ posts, onPostClick }) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Browse All</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {posts.map((post, index) => (
          <ExplorePostCard key={post.id} post={post} index={index} onClick={onPostClick} />
        ))}
      </div>
    </>
  );
};

export default RegularPostsGrid;
