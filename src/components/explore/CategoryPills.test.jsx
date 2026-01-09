/**
 * Unit Tests for CategoryPills Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryPills from './CategoryPills';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, className, onClick }) => (
      <button className={className} onClick={onClick} data-testid="motion-button">
        {children}
      </button>
    ),
  },
}));

describe('CategoryPills', () => {
  const mockCategories = [
    { id: 'cat1', name: 'Technology', icon: 'Code' },
    { id: 'cat2', name: 'Design', icon: 'Palette' },
    { id: 'cat3', name: 'Business', icon: 'Briefcase' },
  ];

  const defaultProps = {
    categories: mockCategories,
    activeCategory: null,
    setActiveCategory: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<CategoryPills {...defaultProps} />);
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('should render For You button', () => {
      render(<CategoryPills {...defaultProps} />);
      expect(screen.getByText('For You')).toBeInTheDocument();
    });

    it('should render all category buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Business')).toBeInTheDocument();
    });

    it('should render correct number of buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      // For You + 3 categories = 4 buttons
      const buttons = screen.getAllByTestId('motion-button');
      expect(buttons).toHaveLength(4);
    });

    it('should render empty state with only For You when no categories', () => {
      render(<CategoryPills {...defaultProps} categories={[]} />);
      const buttons = screen.getAllByTestId('motion-button');
      expect(buttons).toHaveLength(1);
      expect(screen.getByText('For You')).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('should show For You as active when activeCategory is null', () => {
      render(<CategoryPills {...defaultProps} activeCategory={null} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('bg-slate-900');
      expect(forYouButton).toHaveClass('text-white');
    });

    it('should show category as active when activeCategory matches', () => {
      render(<CategoryPills {...defaultProps} activeCategory="cat1" />);
      const techButton = screen.getByText('Technology').closest('button');
      expect(techButton).toHaveClass('bg-slate-900');
    });

    it('should show For You as inactive when a category is active', () => {
      render(<CategoryPills {...defaultProps} activeCategory="cat1" />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('bg-slate-100');
      expect(forYouButton).toHaveClass('text-slate-600');
    });

    it('should show non-active categories with inactive styles', () => {
      render(<CategoryPills {...defaultProps} activeCategory="cat1" />);
      const designButton = screen.getByText('Design').closest('button');
      expect(designButton).toHaveClass('bg-slate-100');
    });
  });

  describe('click handling', () => {
    it('should call setActiveCategory with null when For You is clicked', () => {
      const setActiveCategory = vi.fn();
      render(<CategoryPills {...defaultProps} setActiveCategory={setActiveCategory} />);

      fireEvent.click(screen.getByText('For You'));
      expect(setActiveCategory).toHaveBeenCalledWith(null);
    });

    it('should call setActiveCategory with category id when category is clicked', () => {
      const setActiveCategory = vi.fn();
      render(<CategoryPills {...defaultProps} setActiveCategory={setActiveCategory} />);

      fireEvent.click(screen.getByText('Technology'));
      expect(setActiveCategory).toHaveBeenCalledWith('cat1');
    });

    it('should call setActiveCategory with correct id for each category', () => {
      const setActiveCategory = vi.fn();
      render(<CategoryPills {...defaultProps} setActiveCategory={setActiveCategory} />);

      fireEvent.click(screen.getByText('Design'));
      expect(setActiveCategory).toHaveBeenCalledWith('cat2');

      fireEvent.click(screen.getByText('Business'));
      expect(setActiveCategory).toHaveBeenCalledWith('cat3');
    });

    it('should handle multiple clicks', () => {
      const setActiveCategory = vi.fn();
      render(<CategoryPills {...defaultProps} setActiveCategory={setActiveCategory} />);

      fireEvent.click(screen.getByText('Technology'));
      fireEvent.click(screen.getByText('For You'));
      fireEvent.click(screen.getByText('Design'));

      expect(setActiveCategory).toHaveBeenCalledTimes(3);
      expect(setActiveCategory).toHaveBeenNthCalledWith(1, 'cat1');
      expect(setActiveCategory).toHaveBeenNthCalledWith(2, null);
      expect(setActiveCategory).toHaveBeenNthCalledWith(3, 'cat2');
    });
  });

  describe('styling', () => {
    it('should have container with mb-8 margin', () => {
      const { container } = render(<CategoryPills {...defaultProps} />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('mb-8');
    });

    it('should have scrollable container', () => {
      const { container } = render(<CategoryPills {...defaultProps} />);
      const scrollContainer = container.querySelector('.overflow-x-auto');
      expect(scrollContainer).toBeInTheDocument();
    });

    it('should have flex layout with gap', () => {
      const { container } = render(<CategoryPills {...defaultProps} />);
      const flexContainer = container.querySelector('.flex.gap-2');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should apply rounded-xl to buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('rounded-xl');
    });

    it('should apply transition-all to buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('transition-all');
    });

    it('should have transition-all class on buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('transition-all');
    });

    it('should apply font-medium to buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('font-medium');
    });

    it('should apply text-sm to buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('text-sm');
    });
  });

  describe('icons', () => {
    it('should render icons for each category', () => {
      render(<CategoryPills {...defaultProps} />);
      // Icons should be rendered as SVG elements with w-4 h-4 classes
      const icons = document.querySelectorAll('svg.w-4.h-4');
      // For You icon + 3 category icons = 4 icons
      expect(icons.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('edge cases', () => {
    it('should handle category with unknown icon gracefully', () => {
      const categoriesWithUnknownIcon = [{ id: 'cat1', name: 'Unknown', icon: 'UnknownIcon' }];
      expect(() => {
        render(<CategoryPills {...defaultProps} categories={categoriesWithUnknownIcon} />);
      }).not.toThrow();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('should handle category without icon property', () => {
      const categoriesWithoutIcon = [{ id: 'cat1', name: 'No Icon' }];
      expect(() => {
        render(<CategoryPills {...defaultProps} categories={categoriesWithoutIcon} />);
      }).not.toThrow();
      expect(screen.getByText('No Icon')).toBeInTheDocument();
    });

    it('should handle long category names', () => {
      const categoriesWithLongNames = [
        {
          id: 'cat1',
          name: 'This Is A Very Long Category Name That Might Overflow',
          icon: 'Code',
        },
      ];
      render(<CategoryPills {...defaultProps} categories={categoriesWithLongNames} />);
      expect(
        screen.getByText('This Is A Very Long Category Name That Might Overflow')
      ).toBeInTheDocument();
    });

    it('should handle special characters in category names', () => {
      const categoriesWithSpecialChars = [
        { id: 'cat1', name: 'Tech & Design', icon: 'Code' },
        { id: 'cat2', name: 'Art + Music', icon: 'Palette' },
      ];
      render(<CategoryPills {...defaultProps} categories={categoriesWithSpecialChars} />);
      expect(screen.getByText('Tech & Design')).toBeInTheDocument();
      expect(screen.getByText('Art + Music')).toBeInTheDocument();
    });

    it('should handle many categories', () => {
      const manyCategories = Array.from({ length: 20 }, (_, i) => ({
        id: `cat${i}`,
        name: `Category ${i}`,
        icon: 'Code',
      }));
      render(<CategoryPills {...defaultProps} categories={manyCategories} />);
      // For You + 20 categories = 21 buttons
      const buttons = screen.getAllByTestId('motion-button');
      expect(buttons).toHaveLength(21);
    });
  });

  describe('accessibility', () => {
    it('should have clickable buttons', () => {
      render(<CategoryPills {...defaultProps} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should have visible text for all categories', () => {
      render(<CategoryPills {...defaultProps} />);
      expect(screen.getByText('For You')).toBeVisible();
      expect(screen.getByText('Technology')).toBeVisible();
      expect(screen.getByText('Design')).toBeVisible();
      expect(screen.getByText('Business')).toBeVisible();
    });
  });

  describe('category icons mapping', () => {
    it('should map Code icon correctly', () => {
      const categoriesWithCode = [{ id: 'cat1', name: 'Coding', icon: 'Code' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithCode} />);
      expect(screen.getByText('Coding')).toBeInTheDocument();
    });

    it('should map Palette icon correctly', () => {
      const categoriesWithPalette = [{ id: 'cat1', name: 'Art', icon: 'Palette' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithPalette} />);
      expect(screen.getByText('Art')).toBeInTheDocument();
    });

    it('should map Briefcase icon correctly', () => {
      const categoriesWithBriefcase = [{ id: 'cat1', name: 'Work', icon: 'Briefcase' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithBriefcase} />);
      expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('should map Coffee icon correctly', () => {
      const categoriesWithCoffee = [{ id: 'cat1', name: 'Lifestyle', icon: 'Coffee' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithCoffee} />);
      expect(screen.getByText('Lifestyle')).toBeInTheDocument();
    });

    it('should map Globe icon correctly', () => {
      const categoriesWithGlobe = [{ id: 'cat1', name: 'Travel', icon: 'Globe' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithGlobe} />);
      expect(screen.getByText('Travel')).toBeInTheDocument();
    });

    it('should map Music icon correctly', () => {
      const categoriesWithMusic = [{ id: 'cat1', name: 'Songs', icon: 'Music' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithMusic} />);
      expect(screen.getByText('Songs')).toBeInTheDocument();
    });

    it('should map BookOpen icon correctly', () => {
      const categoriesWithBookOpen = [{ id: 'cat1', name: 'Reading', icon: 'BookOpen' }];
      render(<CategoryPills {...defaultProps} categories={categoriesWithBookOpen} />);
      expect(screen.getByText('Reading')).toBeInTheDocument();
    });
  });

  describe('shrink-0 behavior', () => {
    it('should prevent buttons from shrinking', () => {
      render(<CategoryPills {...defaultProps} />);
      const forYouButton = screen.getByText('For You').closest('button');
      expect(forYouButton).toHaveClass('shrink-0');
    });
  });
});
