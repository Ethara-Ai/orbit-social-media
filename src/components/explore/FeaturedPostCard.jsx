import { motion } from "framer-motion";
import { Heart } from "../icons";
import Avatar from "../common/Avatar";

const FeaturedPostCard = ({
  post,
  index,
  onClick,
}) => {
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  const handleAvatarError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";
  };

  return (
    <motion.article
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(post)}
    >
      {/* Background Image */}
      <img
        src={post.image || "/placeholder.svg"}
        alt={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={handleImageError}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={post.user.avatar || "/placeholder.svg"}
            alt={post.user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
            onError={handleAvatarError}
          />
          <span className="text-white text-sm font-medium">
            {post.user.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-tight mb-2">
          {post.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <span className="flex items-center gap-1">
            <Heart
              className={`w-4 h-4 ${post.isLiked ? "fill-current text-rose-400" : ""}`}
            />
            {post.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default FeaturedPostCard;
