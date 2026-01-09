// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BORDER_RADIUS } from "../../utils/constants";

const Badge = ({
  count,
  variant = "primary",
  size = "md",
  animate = true,
  className = "",
}) => {
  if (!count || count <= 0) return null;

  const variants = {
    primary: "bg-orange-500 text-white",
    secondary: "bg-slate-500 text-white",
    danger: "bg-red-500 text-white",
    success: "bg-emerald-500 text-white",
    light: "bg-white/20 text-white",
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 min-w-[16px]",
    md: "text-xs px-2 py-0.5 min-w-[20px]",
    lg: "text-sm px-2.5 py-1 min-w-[24px]",
  };

  const baseClasses = `${BORDER_RADIUS.badge} text-center font-semibold ${variants[variant]} ${sizes[size]} ${className}`;

  if (animate) {
    return (
      <motion.span
        className={baseClasses}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        {count > 99 ? "99+" : count}
      </motion.span>
    );
  }

  return <span className={baseClasses}>{count > 99 ? "99+" : count}</span>;
};

export default Badge;
