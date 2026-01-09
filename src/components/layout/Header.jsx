// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useUser, useUI } from "../../context/AppContext";
import { Sun, Moon, Users } from "../icons";
import { BORDER_RADIUS } from "../../utils/constants";

const Header = () => {
  const { currentUserAvatar, currentUserDetails } = useUser();
  const {
    activeTab,
    setActiveTab,
    showMobileNav,
    setShowMobileNav,
    isDarkMode,
    toggleTheme,
  } = useUI();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-40 px-2 sm:px-4 lg:px-5 w-full max-w-[100vw] transition-colors duration-300">
      <div className="h-full max-w-(--breakpoint-2xl) mx-auto flex items-center justify-between gap-2">
        {/* Logo - Clickable on mobile to open sidebar */}
        <motion.button
          onClick={() => setShowMobileNav(!showMobileNav)}
          className="flex items-center gap-2 lg:pointer-events-none shrink-0 cursor-pointer min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 justify-center lg:justify-start"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-10 h-10 bg-linear-to-br from-orange-500 to-amber-500 ${BORDER_RADIUS.card} flex items-center justify-center shadow-lg shadow-orange-500/25`}>
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block transition-colors">
            Orbit
          </span>
        </motion.button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Actions */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* User Profile - Clickable to navigate to profile */}
          <motion.button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-2 sm:gap-3 order-1 cursor-pointer min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 justify-center lg:justify-end"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                {currentUserDetails.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                {currentUserDetails.profession}
              </p>
            </div>
            <img
              src={currentUserAvatar || "/placeholder.svg"}
              alt={currentUserDetails.name}
              className={`w-8 h-8 sm:w-9 sm:h-9 ${BORDER_RADIUS.avatar} object-cover ring-2 ring-slate-100 dark:ring-slate-700 transition-all`}
            />
          </motion.button>

          {/* Connections Button */}
          <motion.button
            onClick={() => setActiveTab("connections")}
            className={`min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} flex items-center justify-center transition-all order-2 cursor-pointer ${activeTab === "connections"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Connections"
          >
            <Users className="w-5 h-5" />
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className={`relative min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors duration-300 order-3 cursor-pointer`}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
