import { useState } from "react";

const PostContent = ({ content, image }) => {
  const [imageAspect, setImageAspect] = useState(null);

  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const aspect = naturalWidth / naturalHeight;
    setImageAspect(aspect);
  };

  // Determine if image is portrait (taller than wide)
  const isPortrait = imageAspect !== null && imageAspect < 1;

  return (
    <>
      {/* Post Content */}
      {content && (
        <div className="px-3 sm:px-3.5 pb-2 sm:pb-2.5">
          <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed transition-colors">
            {content}
          </p>
        </div>
      )}

      {/* Post Image */}
      {image && (
        <div className="px-3 sm:px-3.5 pb-2 sm:pb-2.5">
          <div
            className={`relative w-full rounded-md sm:rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 ${
              isPortrait ? "max-w-md mx-auto" : ""
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-auto max-h-[70vh] object-contain rounded-md sm:rounded-lg"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostContent;
