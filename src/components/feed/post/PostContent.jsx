import { useState } from 'react';
import { linkifyText } from '../../../utils/stringUtils';

const PostContent = ({ content, image, images }) => {
  const [imageAspect, setImageAspect] = useState(null);

  const handleImageError = (e) => {
    e.target.src =
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop';
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const aspect = naturalWidth / naturalHeight;
    setImageAspect(aspect);
  };

  // Prepare images array
  const allImages = images && images.length > 0 ? images : image ? [image] : [];

  // Determine if single image is portrait (taller than wide)
  const isPortrait = imageAspect !== null && imageAspect < 1;

  return (
    <>
      {/* Post Content */}
      {content && (
        <div className="px-4 pb-3">
          <p className="text-slate-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed transition-colors">
            {linkifyText(content).map((part) => {
              if (part.type === 'link') {
                return (
                  <a
                    key={part.key}
                    href={part.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part.content}
                  </a>
                );
              }
              return <span key={part.key}>{part.content}</span>;
            })}
          </p>
        </div>
      )}

      {/* Post Images */}
      {allImages.length > 0 && (
        <div className="px-4 pb-3">
          {allImages.length === 1 ? (
            /* Single Image */
            <div
              className={`relative w-full rounded-md sm:rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-900 ${isPortrait ? 'max-w-md mx-auto' : ''
                }`}
            >
              <img
                src={allImages[0] || '/placeholder.svg'}
                alt="Post content"
                className="w-full h-auto max-h-[70vh] object-contain rounded-md sm:rounded-lg"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </div>
          ) : (
            /* Multi Image Grid */
            <div className={`grid gap-2 ${allImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {allImages.map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="relative rounded-md sm:rounded-lg overflow-hidden bg-slate-100 dark:bg-neutral-900 aspect-square"
                >
                  <img
                    src={imgSrc}
                    alt={`Post content ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostContent;
