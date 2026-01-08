import { useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Camera, X } from "../icons";
import { useFeed } from "../../context/AppContext";
import { useUser } from "../../context/AppContext";

const CreatePost = () => {
  // Access state and actions directly from context
  const {
    newPostContent,
    setNewPostContent,
    selectedImage,
    setSelectedImage,
    handleCreatePost,
    handleImageUpload,
  } = useFeed();

  // Access user data from context
  const { currentUser, currentUserAvatar } = useUser();

  // Ref for auto-resizing textarea
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset to minimum height first
      textarea.style.height = "30px";
      // Only expand if content overflows
      if (textarea.scrollHeight > 30) {
        textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
      }
    }
  }, [newPostContent]);

  const removeSelectedMedia = () => {
    setSelectedImage(null);
  };

  const handleTextChange = (e) => {
    setNewPostContent(e.target.value);
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-3 w-full max-w-[100vw] overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex gap-2.5">
        <img
          src={currentUserAvatar || "/placeholder.svg"}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover shrink-0"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
          }}
        />
        <div className="flex-1 min-w-0">
          {/* Text Input Area with inline buttons */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700/50 rounded-full focus-within:ring-1 focus-within:ring-orange-500/50 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all px-3 py-1.5">
            <textarea
              ref={textareaRef}
              placeholder="Share something..."
              value={newPostContent}
              onChange={handleTextChange}
              className="flex-1 bg-transparent border-0 resize-none focus:outline-hidden text-slate-900 dark:text-white placeholder-slate-500 text-xs sm:text-sm leading-tight overflow-hidden py-2"
              style={{ height: "30px", maxHeight: "120px" }}
              rows={1}
            />

            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                onClick={() => document.getElementById("image-upload")?.click()}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-full transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add photo"
              >
                <Camera className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && !selectedImage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded-full font-semibold text-[10px] sm:text-[11px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
                whileHover={{
                  scale: newPostContent.trim() || selectedImage ? 1.02 : 1,
                }}
                whileTap={{
                  scale: newPostContent.trim() || selectedImage ? 0.98 : 1,
                }}
              >
                Share
              </motion.button>
            </div>
          </div>

          {/* Selected Image Preview */}
          {selectedImage && (
            <div className="mt-2 sm:mt-3 relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-h-64 sm:max-h-80 object-contain"
              />
              <button
                onClick={removeSelectedMedia}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-slate-900/80 text-white rounded-full p-1 sm:p-1.5 hover:bg-slate-900 transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
