import { useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Camera, X } from '../icons';
import { useFeed, useUser } from '../../context/AppContext';
import { useFeedActions } from '../../hooks/useFeedActions';
import { createImageErrorHandler } from '../../utils/fileUtils';
import { BORDER_RADIUS, TEXTAREA_MIN_HEIGHT, TEXTAREA_MAX_HEIGHT } from '../../utils/constants';

const CreatePost = () => {
  // Access state from context
  const { newPostContent, setNewPostContent, selectedImages, setSelectedImages } = useFeed();

  // Access actions from hook
  const { handleCreatePost, handleImageUpload } = useFeedActions();

  // Access user data from context
  const { currentUser, currentUserAvatar } = useUser();

  // Ref for auto-resizing textarea
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset to minimum height first to calculate proper scrollHeight
      textarea.style.height = 'auto';
      // Calculate new height based on content, with min and max bounds
      const newHeight = Math.max(
        TEXTAREA_MIN_HEIGHT,
        Math.min(textarea.scrollHeight, TEXTAREA_MAX_HEIGHT)
      );
      textarea.style.height = `${newHeight}px`;
    }
  }, [newPostContent]);

  const removeSelectedMedia = (indexToCheck) => {
    setSelectedImages((prev) => prev.filter((_, index) => index !== indexToCheck));
  };

  const handleTextChange = (e) => {
    setNewPostContent(e.target.value);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-neutral-800 ${BORDER_RADIUS.cardSmall} shadow-sm border border-slate-200 dark:border-neutral-700 p-3 w-full max-w-[100vw] overflow-hidden transition-colors duration-300`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex gap-2.5 items-center">
        <img
          src={currentUserAvatar || '/placeholder.svg'}
          alt={currentUser.name}
          className={`w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.avatar} object-cover shrink-0`}
          onError={createImageErrorHandler()}
        />
        <div className="flex-1 min-w-0">
          {/* Text Input Area with inline buttons */}
          <div
            className={`group relative bg-slate-100 dark:bg-neutral-700/50 ${BORDER_RADIUS.cardLarge} focus-within:ring-1 focus-within:ring-orange-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all border border-transparent focus-within:border-slate-200 dark:focus-within:border-slate-600`}
          >
            {/* Textarea with proper padding to avoid overlap with buttons */}
            <textarea
              ref={textareaRef}
              placeholder="Share something..."
              value={newPostContent}
              onChange={handleTextChange}
              className="block w-full bg-transparent border-0 resize-none focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-500 text-xs sm:text-sm leading-normal pl-3 sm:pl-4 pr-24 sm:pr-26 py-2.5 sm:py-3 scrollbar-hide"
              style={{
                minHeight: `${TEXTAREA_MIN_HEIGHT}px`,
                maxHeight: `${TEXTAREA_MAX_HEIGHT}px`,
                overflowY: 'auto',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
              rows={1}
            />

            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={(e) => {
                handleImageUpload(e);
                e.target.value = ''; // Reset input to allow same file selection
              }}
              className="hidden"
            />

            {/* Action buttons positioned absolutely and vertically centered */}
            <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
              <motion.button
                onClick={() => document.getElementById('image-upload')?.click()}
                className={`p-1.5 sm:p-2 text-slate-500 dark:text-neutral-400 hover:text-emerald-500 dark:hover:text-emerald-400 ${BORDER_RADIUS.button} transition-colors cursor-pointer bg-slate-100 dark:bg-neutral-700/50 group-focus-within:bg-white dark:group-focus-within:bg-slate-800 hover:bg-slate-200 dark:hover:bg-neutral-600`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add photo"
                type="button"
              >
                <Camera className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && selectedImages.length === 0}
                className={`bg-orange-500 hover:bg-orange-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-1.5 ${BORDER_RADIUS.button} font-semibold text-[10px] sm:text-[11px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 whitespace-nowrap`}
                whileHover={{
                  scale: newPostContent.trim() || selectedImages.length > 0 ? 1.02 : 1,
                }}
                whileTap={{
                  scale: newPostContent.trim() || selectedImages.length > 0 ? 0.98 : 1,
                }}
                type="button"
              >
                Share
              </motion.button>
            </div>
          </div>

          {/* Selected Image Preview (Grid) */}
          {selectedImages.length > 0 && (
            <div className="mt-2 sm:mt-3 grid grid-cols-2 gap-2">
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-900 group"
                >
                  <img
                    src={image}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-auto max-h-40 sm:max-h-50 object-cover"
                  />
                  <button
                    onClick={() => removeSelectedMedia(index)}
                    className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-slate-900/80 text-white ${BORDER_RADIUS.button} p-1 sm:p-1.5 hover:bg-slate-900 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100`}
                    type="button"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
