// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "../../icons";
import { useNotifications } from "../../../context/AppContext";

const NotificationPopup = () => {
  const {
    showNotificationPopup,
    latestNotification,
    dismissNotificationPopup,
  } = useNotifications();

  return (
    <AnimatePresence>
      {showNotificationPopup && latestNotification && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-20 right-4 lg:right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 max-w-sm z-50 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <img
              src={latestNotification.user.avatar || "/placeholder.svg"}
              alt={latestNotification.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm transition-colors">
                {latestNotification.user.name}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-xs truncate transition-colors">
                {latestNotification.message}
              </p>
            </div>
            <button
              onClick={dismissNotificationPopup}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
