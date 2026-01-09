// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BORDER_RADIUS } from '../../utils/constants';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-['Inter',sans-serif] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200 dark:bg-orange-500 ${BORDER_RADIUS.badge} blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200 dark:bg-amber-500 ${BORDER_RADIUS.badge} blur-3xl animate-pulse`}
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <motion.div
            className={`w-20 h-20 mx-auto mb-6 bg-linear-to-br from-orange-500 to-amber-500 ${BORDER_RADIUS.cardLarge} flex items-center justify-center shadow-2xl shadow-orange-500/30`}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-white text-3xl font-bold">O</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 transition-colors"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Orbit
          </motion.h1>

          <motion.p
            className="text-slate-500 dark:text-neutral-400 text-lg font-medium transition-colors"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Connect • Discover • Thrive
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-56 mx-auto"
        >
          {/* Loading dots */}
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 bg-orange-500 ${BORDER_RADIUS.badge}`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.p
            className="text-slate-400 dark:text-neutral-500 text-sm transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            Launching your orbit...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
