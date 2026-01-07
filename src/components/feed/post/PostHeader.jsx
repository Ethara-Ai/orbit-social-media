import Avatar from "../../common/Avatar";

const PostHeader = ({ user, timestamp }) => {
  return (
    <div className="p-3 sm:p-4 pb-2 sm:pb-3">
      <div className="flex items-center gap-2 sm:gap-3">
        <Avatar
          src={user.avatar}
          alt={user.name}
          size="md"
          isOnline={user.isOnline}
          showStatus={true}
          className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate transition-colors">
              {user.name}
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 transition-colors">
            {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
