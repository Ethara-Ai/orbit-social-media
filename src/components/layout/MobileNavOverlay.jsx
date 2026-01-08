// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../../context/AppContext";

const MobileNavOverlay = () => {
  const { showMobileNav, closeMobileNav } = useUI();

  return (
    <AnimatePresence>
      {showMobileNav && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          style={{
            // Use backdrop-filter with GPU optimization hints
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            // Optimize rendering performance on mobile
            willChange: "opacity",
            contain: "strict",
            // Prevent overflow issues causing blur bleed
            isolation: "isolate",
          }}
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
