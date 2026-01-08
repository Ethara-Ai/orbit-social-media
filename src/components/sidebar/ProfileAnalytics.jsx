import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, BarChart3 } from "../icons";

const ProfileAnalytics = () => {
  const [profileViewers, setProfileViewers] = useState(0);
  const [postImpressions, setPostImpressions] = useState(0);

  // Generate random values on mount
  useEffect(() => {
    // Generate random profile viewers between 50 and 500
    const viewers = Math.floor(Math.random() * 451) + 50;
    setProfileViewers(viewers);

    // Generate random post impressions between 200 and 2000
    const impressions = Math.floor(Math.random() * 1801) + 200;
    setPostImpressions(impressions);
  }, []);

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
      <div className="flex flex-col py-2 -mx-3">
        {/* Profile Viewers */}
        <div className="flex items-center justify-between px-4 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Profile viewers
          </p>
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {formatNumber(profileViewers)}
          </p>
        </div>

        {/* Post Impressions */}
        <div className="flex items-center justify-between px-4 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
            Post impressions
          </p>
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {formatNumber(postImpressions)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileAnalytics;
