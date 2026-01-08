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
  const cardProps = {};

  return (
    <CardWrapper
      className="cursor-default"
      {...cardProps}
    >
      {/* User Info Section - Centered */}
      <div className="flex flex-col items-center text-center pb-4">
        <Avatar
          src={avatar}
          alt={user.name}
          size="xl"
          isOnline={true}
          showStatus={true}
          ring={false}
        />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mt-3">
          {user.name}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {user.profession}
        </p>
      </div>

      {/* Stats Section with Separator */}
      <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
        <div className="flex justify-around">
          <StatItem label="Posts" value={stats.posts} />
          <div className="w-px bg-slate-100 dark:bg-slate-700" />
          <StatItem label="Followers" value={stats.followers} />
          <div className="w-px bg-slate-100 dark:bg-slate-700" />
          <StatItem label="Following" value={stats.following} />
        </div>
      </div>
    </CardWrapper>
  );
};

const StatItem = ({ label, value }) => (
  <div className="text-center px-2">
    <div className="text-sm font-bold text-slate-900 dark:text-white">
      {value}
    </div>
    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
      {label}
    </div>
  </div>
);

export default UserProfileCard;
