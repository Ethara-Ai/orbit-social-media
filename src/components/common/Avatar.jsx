import { motion } from "framer-motion";

const Avatar = ({
  src,
  alt,
  size = "md",
  isOnline,
  showStatus = false,
  className = "",
  onClick,
  ring = false,
  ringColor = "white",
}) => {
  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-11 h-11",
    xl: "w-12 h-12",
    "2xl": "w-14 h-14",
  };

  const statusSizeClasses = {
    xs: "w-1.5 h-1.5 border",
    sm: "w-2.5 h-2.5 border-2",
    md: "w-3 h-3 border-2",
    lg: "w-3.5 h-3.5 border-2",
    xl: "w-4 h-4 border-2",
    "2xl": "w-4 h-4 border-2",
  };

  const ringClasses = {
    white: "ring-white",
    slate: "ring-slate-100",
    orange: "ring-orange-500/50",
  };

  const fallbackImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face";

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const Component = onClick ? motion.div : "div";
  const componentProps = onClick
    ? {
        onClick,
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        className: "cursor-pointer",
      }
    : {};

  return (
    <Component {...componentProps} className={`relative shrink-0 ${onClick ? "cursor-pointer" : ""}`}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt || "User avatar"}
        className={`
          ${sizeClasses[size]}
          rounded-full
          object-cover
          ${ring ? `ring-2 ${ringClasses[ringColor]} shadow-md` : ""}
          ${className}
        `}
        onError={handleImageError}
      />
      {showStatus && isOnline && (
        <div
          className={`
            absolute
            -bottom-0.5
            -right-0.5
            ${statusSizeClasses[size]}
            bg-emerald-400
            rounded-full
            border-white
          `}
        />
      )}
    </Component>
  );
};

export default Avatar;
