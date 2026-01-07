import { motion } from "framer-motion";
import Avatar from "../common/Avatar";

const UserProfileCard = ({
  user,
  avatar,
  onClick,
  stats = {
    posts: 142,
    followers: "24.7K",
    following: 318,
  },
  animated = true,
}) => {
  const CardWrapper = animated ? motion.div : "div";
  const cardProps = animated
    ? {
        whileHover: { scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
        transition: { type: "spring", stiffness: 300 },
      }
    : {};

  return (
    <CardWrapper
      className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl p-4 mb-6 cursor-pointer border border-slate-200/50 dark:border-slate-700/50 transition-colors duration-300"
      onClick={onClick}
      {...cardProps}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          src={avatar}
          alt={user.name}
          size="xl"
          isOnline={true}
          showStatus={true}
          ring={true}
          ringColor="white"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate transition-colors">
            {user.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">
            {user.profession}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <StatItem label="Posts" value={stats.posts} />
        <StatItem label="Followers" value={stats.followers} />
        <StatItem label="Following" value={stats.following} />
      </div>
    </CardWrapper>
  );
};

const StatItem = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-700 rounded-lg py-2 px-1 transition-colors">
    <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
      {value}
    </div>
    <div className="text-[10px] text-slate-500 dark:text-slate-400 transition-colors">
      {label}
    </div>
  </div>
);

export default UserProfileCard;
