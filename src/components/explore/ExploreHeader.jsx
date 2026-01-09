// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ExploreHeader = () => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
        Discover
      </h1>
      <p className="text-slate-500 dark:text-neutral-400 text-sm mt-1 transition-colors">
        Explore content from creators worldwide
      </p>
    </motion.div>
  );
};

export default ExploreHeader;
