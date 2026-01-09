// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileNav } from '../../context/providers/ui';

const MobileNavOverlay = () => {
  // Use focused hook for better performance - only re-renders when mobile nav state changes
  const { showMobileNav, closeMobileNav } = useMobileNav();

  return (
    <AnimatePresence>
      {showMobileNav && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeMobileNav}
        />
      )}
    </AnimatePresence>
  );
};

export default MobileNavOverlay;
