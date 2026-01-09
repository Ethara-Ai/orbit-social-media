// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationPopup } from '../../../context/providers/ui';
import { BORDER_RADIUS } from '../../../utils/constants';

const CopyNotificationPopup = () => {
  // Use focused hook for better performance - only re-renders when notification popup state changes
  const { showCopyNotification, copyNotificationMessage } = useNotificationPopup();

  return (
    <AnimatePresence>
      {showCopyNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 ${BORDER_RADIUS.card} shadow-2xl z-50 flex items-center gap-2`}
        >
          <svg
            className="w-5 h-5 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {copyNotificationMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopyNotificationPopup;
