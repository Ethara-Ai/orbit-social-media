import { motion, AnimatePresence } from "framer-motion";
import { useUser, useUI } from "../../context/AppContext";
import { Sun, Moon } from "../icons";

const Header = () => {
  const { currentUser } = useUser();
  const {
    showMobileNav,
    setShowMobileNav,
    setShowCurrentUserModal,
    isDarkMode,
    toggleTheme,
  } = useUI();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-40 px-2 sm:px-4 lg:px-6 w-full max-w-[100vw] transition-colors duration-300">
      <div className="h-full max-w-screen-2xl mx-auto flex items-center justify-between gap-2">
        {/* Logo - Clickable on mobile to open sidebar */}
        <motion.button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="flex items-center gap-2 lg:pointer-events-none flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
            <span className="text-white font-bold text-base sm:text-lg">O</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block transition-colors">
            Orbit
          </span>
        </motion.button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {isDarkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-5 h-5 text-amber-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-5 h-5 text-slate-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* User Profile */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowCurrentUserModal(true)}
          >
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt={currentUser.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
            />
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                {currentUser.profession}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
