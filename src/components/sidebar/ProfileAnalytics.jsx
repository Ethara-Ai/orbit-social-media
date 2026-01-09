import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useUI } from "../../context/AppContext";
import { Eye, BarChart3 } from "../icons";

const ProfileAnalytics = () => {
  const { setActiveTab } = useUI();
  // Initialize with random values using function initializers to avoid useEffect
  const [profileViewers] = useState(() => Math.floor(Math.random() * 451) + 50);
  const [postImpressions] = useState(
    () => Math.floor(Math.random() * 1801) + 200,
  );
  const [likesAndComments] = useState(
    () => Math.floor(Math.random() * 901) + 100,
  );

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3 transition-colors duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col py-1 -mx-3">
        {/* Profile Viewers */}
        <div className="flex items-center justify-between px-4 py-0.5 transition-colors group">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Profile viewers
          </p>
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {formatNumber(profileViewers)}
          </p>
        </div>

        {/* Post Impressions */}
        <div className="flex items-center justify-between px-4 py-0.5 transition-colors group">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Post impressions
          </p>
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {formatNumber(postImpressions)}
          </p>
        </div>

        {/* Likes and Comments */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveTab("notifications")}
          onKeyDown={(e) => e.key === "Enter" && setActiveTab("notifications")}
          className="flex items-center justify-between px-4 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Likes and comments
          </p>
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {formatNumber(likesAndComments)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileAnalytics;
