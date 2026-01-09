import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';

const UserProfileCard = ({
  user,
  avatar,
  onClick,
  stats = {
    posts: 142,
    followers: '24.7K',
    following: 318,
  },
  animated = true,
}) => {
  const CardWrapper = animated ? motion.div : 'div';
  const cardProps = animated
    ? {
        onClick,
        whileHover: onClick ? { scale: 1.02 } : undefined,
        whileTap: onClick ? { scale: 0.98 } : undefined,
      }
    : { onClick };

  return (
    <CardWrapper className={onClick ? 'cursor-pointer' : 'cursor-default'} {...cardProps}>
      {/* User Info Section - Centered */}
      <div className="flex flex-col items-center text-center pb-3">
        <Avatar
          src={avatar}
          alt={user.name}
          size="xl"
          isOnline={true}
          showStatus={true}
          ring={false}
        />
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mt-2.5">{user.name}</h2>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{user.profession}</p>
      </div>

      {/* Stats Section */}
      <div className="border-t border-slate-100 dark:border-neutral-700 pt-3">
        <div className="flex justify-between px-1">
          <StatItem label="Posts" value={stats.posts} />
          <StatItem label="Followers" value={stats.followers} />
          <StatItem label="Following" value={stats.following} />
        </div>
      </div>
    </CardWrapper>
  );
};

const StatItem = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-[16px] font-bold text-slate-900 dark:text-white">{value}</span>
    <span className="text-xs text-slate-500 dark:text-neutral-400">{label}</span>
  </div>
);

export default UserProfileCard;
