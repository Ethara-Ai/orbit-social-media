// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../../context/AppContext";

const MobileNavOverlay = () => {
  const { showMobileNav, closeMobileNav } = useUI();

  return (
    <AnimatePresence>
      {showMobileNav && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileNav}
        />
      )}
    </AnimatePresence>
  );
};

export default MobileNavOverlay;
