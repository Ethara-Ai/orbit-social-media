// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useUI } from '../../context/AppContext';
import { Sun, Moon, Users } from '../icons';
import { BORDER_RADIUS } from '../../utils/constants';
import { createImageErrorHandler } from '../../utils/fileUtils';

const Header = () => {
  const { currentUserAvatar, currentUserDetails } = useUser();
  const { activeTab, setActiveTab, showMobileNav, setShowMobileNav, isDarkMode, toggleTheme } =
    useUI();

  return (
    <>
      <style>
        {`
          .header-container {
            padding-left: 12px;
            padding-right: 12px;
          }

          /* 320px - 374px */
          @media (min-width: 320px) and (max-width: 374px) {
            .header-container {
              padding-left: 15px;
              padding-right: 15px;
            }
          }

          /* 375px - 424px */
          @media (min-width: 375px) and (max-width: 424px) {
            .header-container {
              padding-left: 16px;
              padding-right: 16px;
            }
          }

          /* 425px - 767px */
          @media (min-width: 425px) and (max-width: 767px) {
            .header-container {
              padding-left: 18px;
              padding-right: 18px;
            }
          }

          /* 768px - 1023px */
          @media (min-width: 768px) and (max-width: 1023px) {
            .header-container {
              padding-left: 48px;
              padding-right: 48px;
            }
          }

          /* 1024px - 1439px */
          @media (min-width: 1024px) and (max-width: 1439px) {
            .header-container {
              padding-left: 137px;
              padding-right: 137px;
            }
          }

          /* 1440px - 1919px */
          @media (min-width: 1440px) and (max-width: 1919px) {
            .header-container {
              padding-left: 88px;
              padding-right: 88px;
            }
          }

          /* 1920px and above */
          @media (min-width: 1920px) {
            .header-container {
              padding-left: 160px;
              padding-right: 160px;
            }
          }

          /* Additional ranges for other common screen sizes */

          /* 540px - 639px (small tablets in portrait) */
          @media (min-width: 540px) and (max-width: 639px) {
            .header-container {
              padding-left: 24px;
              padding-right: 24px;
            }
          }

          /* 640px - 767px (tablets in portrait) */
          @media (min-width: 640px) and (max-width: 767px) {
            .header-container {
              padding-left: 32px;
              padding-right: 32px;
            }
          }

          /* 1280px - 1365px (smaller laptops) */
          @media (min-width: 1280px) and (max-width: 1365px) {
            .header-container {
              padding-left: 88px;
              padding-right: 88px;
            }
          }

          /* 1366px - 1439px (common laptop resolution) */
          @media (min-width: 1366px) and (max-width: 1439px) {
            .header-container {
              padding-left: 100px;
              padding-right: 100px;
            }
          }

          /* 1600px - 1919px (large monitors) */
          @media (min-width: 1600px) and (max-width: 1919px) {
            .header-container {
              padding-left: 120px;
              padding-right: 120px;
            }
          }

          /* 2560px and above (4K and ultra-wide) */
          @media (min-width: 2560px) {
            .header-container {
              padding-left: 200px;
              padding-right: 200px;
            }
          }
        `}
      </style>
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 z-40 w-full transition-colors duration-300">
        <div className="h-full max-w-7xl mx-auto header-container">
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
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-3 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`View profile for ${currentUserDetails.name}`}
                  aria-current={activeTab === 'profile' ? 'page' : undefined}
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                      {currentUserDetails.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                      {currentUserDetails.profession}
                    </p>
                  </div>
                  <img
                    src={currentUserAvatar || '/placeholder.svg'}
                    alt=""
                    aria-hidden="true"
                    className={`w-10 h-10 ${BORDER_RADIUS.avatar} object-cover ring-2 ring-slate-100 dark:ring-slate-700 transition-all`}
                    onError={createImageErrorHandler()}
                  />
                </motion.button>

                {/* Connections Button */}
                <motion.button
                  onClick={() => setActiveTab('connections')}
                  className={`w-10 h-10 ${BORDER_RADIUS.card} flex items-center justify-center transition-all cursor-pointer ${
                    activeTab === 'connections'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View connections"
                  aria-current={activeTab === 'connections' ? 'page' : undefined}
                >
                  <Users className="w-5 h-5" aria-hidden="true" />
                </motion.button>

                {/* Theme Toggle Button */}
                <motion.button
                  onClick={toggleTheme}
                  className={`relative w-10 h-10 ${BORDER_RADIUS.card} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors duration-300 cursor-pointer`}
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
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-11 min-h-11 lg:min-w-0 lg:min-h-0 justify-center lg:justify-end"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label={`View profile for ${currentUserDetails.name}`}
                aria-current={activeTab === 'profile' ? 'page' : undefined}
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
                  src={currentUserAvatar || '/placeholder.svg'}
                  alt=""
                  aria-hidden="true"
                  className={`w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.avatar} object-cover ring-2 ring-slate-100 dark:ring-slate-700 transition-all`}
                  onError={createImageErrorHandler()}
                />
              </motion.button>

              {/* Connections Button */}
              <motion.button
                onClick={() => setActiveTab('connections')}
                className={`min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} flex items-center justify-center transition-all cursor-pointer ${
                  activeTab === 'connections'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View connections"
                aria-current={activeTab === 'connections' ? 'page' : undefined}
              >
                <Users className="w-5 h-5" aria-hidden="true" />
              </motion.button>

              {/* Theme Toggle Button */}
              <motion.button
                onClick={toggleTheme}
                className={`relative min-w-11 min-h-11 sm:min-w-0 sm:min-h-0 w-9 h-9 sm:w-10 sm:h-10 ${BORDER_RADIUS.card} bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors duration-300 cursor-pointer`}
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
        </div>
      </header>
    </>
  );
};

export default Header;
