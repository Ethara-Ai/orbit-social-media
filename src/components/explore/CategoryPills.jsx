// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Hash, Code, Palette, Briefcase, Coffee, Globe, Music, BookOpen } from '../icons';
import { BORDER_RADIUS } from '../../utils/constants';

const categoryIcons = {
  Code,
  Palette,
  Briefcase,
  Coffee,
  Globe,
  Music,
  BookOpen,
};

const CategoryPills = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pr-4">
        {/* For You Button */}
        <CategoryPill
          isActive={activeCategory === null}
          onClick={() => setActiveCategory(null)}
          icon={Hash}
          label="For You"
        />

        {/* Category Buttons */}
        {categories.map((category, index) => {
          const IconComponent = categoryIcons[category.icon] || Hash;
          return (
            <CategoryPill
              key={category.id}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              icon={IconComponent}
              label={category.name}
              index={index}
              animated
            />
          );
        })}
      </div>
    </div>
  );
};

const CategoryPill = ({
  isActive,
  onClick,
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  label,
  index = 0,
  animated = false,
}) => {
  const baseClasses = `
    shrink-0
    flex
    items-center
    gap-2
    px-4
    py-2.5
    ${BORDER_RADIUS.card}
    text-sm
    font-medium
    transition-all
    cursor-pointer
  `;

  const activeClasses = isActive
    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';

  if (animated) {
    return (
      <motion.button
        onClick={onClick}
        className={`${baseClasses} ${activeClasses}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );
};

export default CategoryPills;
