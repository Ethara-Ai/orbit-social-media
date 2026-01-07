// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Heart, Zap } from "../icons";
import Avatar from "../common/Avatar";

const ExplorePostCard = ({ post, index, onClick }) => {
  const handleClick = () => {
    onClick(post);
  };

  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop";
  };

  return (
    <motion.article
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer group border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg dark:hover:shadow-slate-900/50 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={handleImageError}
        />

        {/* New Badge */}
        {post.isNew && <NewBadge />}

        {/* Hover Overlay */}
        <HoverOverlay likes={post.likes} isLiked={post.isLiked} />
      </div>

      {/* Content Section */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar src={post.user.avatar} alt={post.user.name} size="xs" />
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
            {post.user.name}
          </span>
        </div>
        <h3 className="font-medium text-slate-900 dark:text-white text-xs line-clamp-2 leading-snug transition-colors">
          {post.title}
        </h3>
      </div>
    </motion.article>
  );
};

const NewBadge = () => {
  return (
    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
      <Zap className="w-2.5 h-2.5" />
      New
    </div>
  );
};

const HoverOverlay = ({ likes, isLiked }) => {
  return (
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <div className="flex items-center gap-4 text-white">
        <span className="flex items-center gap-1">
          <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          {likes.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ExplorePostCard;
