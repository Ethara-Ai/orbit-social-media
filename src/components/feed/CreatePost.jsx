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

  const removeSelectedMedia = () => {
    setSelectedImage(null);
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-3 sm:p-4 mb-4 sm:mb-6 w-full max-w-[100vw] overflow-hidden transition-colors duration-300"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex gap-2 sm:gap-3">
        <img
          src={currentUserAvatar || "/placeholder.svg"}
          alt={currentUser.name}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="relative bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:bg-white dark:focus-within:bg-slate-700 transition-all">
            <textarea
              placeholder="Share something with your orbit..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full p-2 sm:p-3 pb-10 sm:pb-12 bg-transparent border-0 rounded-lg sm:rounded-xl resize-none focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-colors"
              rows={2}
            />

            {/* Action buttons inside input field */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1.5 sm:gap-2">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <motion.button
                onClick={() => document.getElementById("image-upload")?.click()}
                className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-full transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Add photo"
              >
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              <motion.button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() && !selectedImage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
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

          {selectedImage && (
            <div className="mt-2 sm:mt-3 relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-h-64 sm:max-h-80 object-contain"
              />
              <button
                onClick={removeSelectedMedia}
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-slate-900/80 text-white rounded-full p-1 sm:p-1.5 hover:bg-slate-900 transition-colors cursor-pointer"
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
