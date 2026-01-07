const PostContent = ({ content, image }) => {
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  return (
    <>
      {/* Post Content */}
      {content && (
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed transition-colors">
            {content}
          </p>
        </div>
      )}

      {/* Post Image */}
      {image && (
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <img
            src={image || "/placeholder.svg"}
            alt="Post content"
            className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg sm:rounded-xl"
            onError={handleImageError}
          />
        </div>
      )}
    </>
  );
};

export default PostContent;
