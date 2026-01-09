// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  iconClassName = 'w-8 h-8 text-slate-400 dark:text-slate-500',
}) => {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {Icon && (
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
          <Icon className={iconClassName} />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1 transition-colors">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <motion.button
          onClick={action}
          className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

EmptyState.propTypes = {
  /** Icon component to display */
  icon: PropTypes.elementType,
  /** Title text to display */
  title: PropTypes.string,
  /** Description text to display */
  description: PropTypes.string,
  /** Action handler for the optional button */
  action: PropTypes.func,
  /** Label for the action button */
  actionLabel: PropTypes.string,
  /** Additional CSS classes for the icon */
  iconClassName: PropTypes.string,
};

export default EmptyState;
