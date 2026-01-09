import { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useUser, useMessages, useUI } from '../../context/AppContext';
import { useMessagesActions } from '../../hooks/useMessagesActions';
import { TABS, BORDER_RADIUS } from '../../utils/constants';
import ActiveNowSection from './RightSidebar/ActiveNowSection';

const RightSidebar = () => {
  const { activeOnlineFriends, friends } = useUser();
  const { pendingNavigateToMessages } = useMessages();
  const { startConversation, clearPendingNavigation } = useMessagesActions();
  const { setActiveTab } = useUI();

  // Handle navigation to messages tab when a conversation is started
  useEffect(() => {
    if (pendingNavigateToMessages) {
      setActiveTab(TABS.MESSAGES);
      clearPendingNavigation();
    }
  }, [pendingNavigateToMessages, setActiveTab, clearPendingNavigation]);

  return (
    <motion.aside
      className={`w-full bg-white dark:bg-neutral-900 ${BORDER_RADIUS.cardSmall} border border-slate-200 dark:border-neutral-700 transition-colors duration-300`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-3">
        {/* Active Now Section */}
        <ActiveNowSection
          activeOnlineFriends={activeOnlineFriends}
          friends={friends}
          startConversation={startConversation}
        />
      </div>
    </motion.aside>
  );
};

export default RightSidebar;
