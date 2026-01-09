import { memo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';

const FriendItem = memo(function FriendItem({ friend, index, onClick }) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      className={`flex items-center gap-3 p-2 ${BORDER_RADIUS.cardSmall} hover:bg-slate-50 transition-colors cursor-pointer mx-2`}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onClick && onClick(friend)}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(friend)}
    >
      <Avatar
        src={friend.avatar}
        alt={friend.name}
        size="md"
        isOnline={friend.isOnline}
        showStatus={true}
        className="w-9 h-9"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate text-sm">{friend.name}</p>
        <p className="text-xs text-slate-500 truncate">
          {friend.isOnline ? 'Online' : friend.lastSeen}
        </p>
      </div>
    </motion.div>
  );
});

export default FriendItem;
