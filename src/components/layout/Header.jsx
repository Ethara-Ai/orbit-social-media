// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/AppContext';
import { useTab, useTheme, useMobileNav } from '../../context/providers/ui';
import { Sun, Moon, Users } from '../icons';
import { BORDER_RADIUS, TABS } from '../../utils/constants';
import { createImageErrorHandler } from '../../utils/fileUtils';
import LayoutContainer from './LayoutContainer';

const Header = () => {
  const { currentUserAvatar, currentUserDetails } = useUser();
  const { activeTab, setActiveTab } = useTab();
  const { isDarkMode, toggleTheme } = useTheme();
  const { showMobileNav, setShowMobileNav } = useMobileNav();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-700 z-40 w-full transition-colors duration-300">
      <LayoutContainer className="h-full">
        {/* Three Column Layout matching main content */}
        <div className="h-full flex items-center justify-center gap-5">
          {/* Left Column - matches left sidebar width */}
          <div className="hidden lg:flex w-52.5 shrink-0 items-center">
            <motion.button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="flex items-center gap-2 lg:pointer-events-none shrink-0 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={showMobileNav ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileNav}
              aria-controls="mobile-navigation"
            >
              <div
                className={`w-10 h-10 bg-linear-to-br from-orange-500 to-amber-500 ${BORDER_RADIUS.card} flex items-center justify-center shadow-lg shadow-orange-500/25`}
              >
                <span className="text-white font-bold text-lg" aria-hidden="true">
                  O
                </span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
                Orbit
              </span>
            </motion.button>
          </div>

          {/* Mobile Logo - only shows on mobile */}
          <div className="lg:hidden flex items-center">
            <motion.button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="flex items-center gap-2 shrink-0 cursor-pointer min-w-11 min-h-11 justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={showMobileNav ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={showMobileNav}
              aria-controls="mobile-navigation"
            >
              <div
                className={`w-10 h-10 bg-linear-to-br from-orange-500 to-amber-500 ${BORDER_RADIUS.card} flex items-center justify-center shadow-lg shadow-orange-500/25`}
              >
                <span className="text-white font-bold text-lg" aria-hidden="true">
                  O
                </span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block transition-colors">
                Orbit
              </span>
            </motion.button>
          </div>

          {/* Center Column - matches main content width, acts as spacer on desktop */}
          <div className="flex-1 lg:w-130 xl:w-145 shrink-0 min-w-0" />

          {/* Right Column - matches right sidebar width */}
          <div className="hidden xl:flex w-70 shrink-0 items-center justify-end">
            <nav className="flex items-center gap-3" aria-label="User actions">
              {/* User Profile */}
              <motion.button
                onClick={() => setActiveTab(TABS.PROFILE)}
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`View profile for ${currentUserDetails.name}`}
                aria-current={activeTab === TABS.PROFILE ? 'page' : undefined}
              >
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                    {currentUserDetails.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 transition-colors">
                    {currentUserDetails.profession}
                  </p>
                </div>
                <img
                  src={currentUserAvatar || '/placeholder.svg'}
                  alt=""
                  aria-hidden="true"
                  className={`w-10 h-10 ${BORDER_RADIUS.avatar} object-cover ring-2 ring-slate-100 dark:ring-neutral-700 transition-all`}
                  onError={createImageErrorHandler()}
                />
              </motion.button>

              {/* Connections Button */}
              <motion.button
                onClick={() => setActiveTab(TABS.CONNECTIONS)}
                className={`w-10 h-10 ${BORDER_RADIUS.card} flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === TABS.CONNECTIONS
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View connections"
                aria-current={activeTab === TABS.CONNECTIONS ? 'page' : undefined}
              >
                <Users className="w-5 h-5" aria-hidden="true" />
              </motion.button>

              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className={`relative w-10 h-10 ${BORDER_RADIUS.card} bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors duration-300 cursor-pointer`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDarkMode}
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
                      <Sun className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5 text-slate-600" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </nav>
          </div>

          {/* Mobile/Tablet Right Actions - shows when xl right sidebar is hidden */}
          <nav
            className="xl:hidden flex items-center gap-1 sm:gap-3 shrink-0"
            aria-label="User actions"
          >
            {/* User Profile */}
            <motion.button
              onClick={() => setActiveTab(TABS.PROFILE)}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 justify-center lg:justify-end"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`View profile for ${currentUserDetails.name}`}
              aria-current={activeTab === TABS.PROFILE ? 'page' : undefined}
            >
              <div className="hidden lg:block text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                  {currentUserDetails.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-neutral-400 transition-colors">
                  {currentUserDetails.profession}
                </p>
              </div>
              <img
                src={currentUserAvatar || '/placeholder.svg'}
                alt=""
                aria-hidden="true"
                className={`w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.avatar} object-cover ring-2 ring-slate-100 dark:ring-neutral-700 transition-all`}
                onError={createImageErrorHandler()}
              />
            </motion.button>

            {/* Connections Button */}
            <motion.button
              onClick={() => setActiveTab(TABS.CONNECTIONS)}
              className={`min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} flex items-center justify-center transition-all cursor-pointer ${
                activeTab === TABS.CONNECTIONS
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="View connections"
              aria-current={activeTab === TABS.CONNECTIONS ? 'page' : undefined}
            >
              <Users className="w-5 h-5" aria-hidden="true" />
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className={`relative min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors duration-300 cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDarkMode}
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
                    <Sun className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-5 h-5 text-slate-600" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>
        </div>
      </LayoutContainer>
    </header>
  );
};

export default Header;
