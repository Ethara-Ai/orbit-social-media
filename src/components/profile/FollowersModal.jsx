import { createPortal } from 'react-dom';
import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '../icons';
import Avatar from '../common/Avatar';
import { BORDER_RADIUS } from '../../utils/constants';
import { friends } from '../../data/mockData';

const FollowersModal = ({ isOpen, onClose, initialTab = 'followers' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  // Use friends as both followers and following for demo purposes
  // In a real app, these would be separate lists
  const followersList = friends.slice(0, 16);
  const followingList = friends.slice(0, 16);

  const currentList = activeTab === 'followers' ? followersList : followingList;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className={`relative w-full max-w-md bg-white dark:bg-neutral-900 ${BORDER_RADIUS.modal} shadow-2xl overflow-hidden max-h-[80vh] flex flex-col`}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Connections</h2>
          <motion.button
            onClick={onClose}
            className={`p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 ${BORDER_RADIUS.button} transition-colors cursor-pointer`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-slate-500 dark:text-neutral-400" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'followers'
                ? 'text-orange-500'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Followers
            <span className="ml-1 text-xs text-slate-400">({followersList.length})</span>
            {activeTab === 'followers' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                layoutId="followersTab"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'following'
                ? 'text-orange-500'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Following
            <span className="ml-1 text-xs text-slate-400">({followingList.length})</span>
            {activeTab === 'following' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                layoutId="followersTab"
              />
            )}
          </button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'followers' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'followers' ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-slate-100 dark:divide-neutral-800"
            >
              {currentList.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div className="relative">
                    <Avatar src={user.avatar} alt={user.name} size="md" className="w-12 h-12" />
                    {user.isOnline && (
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 ${BORDER_RADIUS.badge} border-2 border-white dark:border-neutral-900`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                      {user.profession}
                    </p>
                    {user.mutualFriends > 0 && (
                      <p className="text-xs text-slate-400 dark:text-neutral-500">
                        {user.mutualFriends} mutual connections
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default FollowersModal;
