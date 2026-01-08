// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ActionButton = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = "full",
  ...props
}) => {
  const baseStyles =
    "font-medium transition-colors cursor-pointer disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 disabled:hover:bg-orange-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40",
    danger: "bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-40",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40",
    outline:
      "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-lg",
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-xs",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${fullWidth ? "w-full" : ""}
        ${className}
        flex items-center justify-center gap-2
      `}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className={iconSizes[size]} />}
      {children}
      {Icon && iconPosition === "right" && <Icon className={iconSizes[size]} />}
    </motion.button>
  );
};

export default ActionButton;
