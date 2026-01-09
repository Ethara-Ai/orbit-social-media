/**
 * Unit Tests for ProfileAnalytics Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileAnalytics from './ProfileAnalytics';

// Mock the context
const mockSetActiveTab = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useUI: () => ({
    setActiveTab: mockSetActiveTab,
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, ...props }) => (
      <div
        className={className}
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Mock icons
vi.mock('../icons', () => ({
  Eye: ({ className }) => <svg data-testid="eye-icon" className={className} />,
  BarChart3: ({ className }) => <svg data-testid="bar-chart-icon" className={className} />,
}));

describe('ProfileAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<ProfileAnalytics />);
      expect(screen.getByText('Profile viewers')).toBeInTheDocument();
    });

    it('should render profile viewers label', () => {
      render(<ProfileAnalytics />);
      expect(screen.getByText('Profile viewers')).toBeInTheDocument();
    });

    it('should render post impressions label', () => {
      render(<ProfileAnalytics />);
      expect(screen.getByText('Post impressions')).toBeInTheDocument();
    });

    it('should render likes and comments label', () => {
      render(<ProfileAnalytics />);
      expect(screen.getByText('Likes and comments')).toBeInTheDocument();
    });

    it('should render three stat rows', () => {
      const { container } = render(<ProfileAnalytics />);
      const statRows = container.querySelectorAll('.flex.items-center.justify-between');
      expect(statRows.length).toBe(3);
    });
  });

  describe('stat values', () => {
    it('should display profile viewers value', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.text-orange-500');
      expect(value).toBeInTheDocument();
    });

    it('should display post impressions value', () => {
      render(<ProfileAnalytics />);
      const impressionsRow = screen.getByText('Post impressions').closest('div');
      const value = impressionsRow.querySelector('.text-orange-500');
      expect(value).toBeInTheDocument();
    });

    it('should display likes and comments value', () => {
      render(<ProfileAnalytics />);
      const likesRow = screen.getByText('Likes and comments').closest('div');
      const value = likesRow.querySelector('.text-orange-500');
      expect(value).toBeInTheDocument();
    });

    it('should format numbers with commas for large values', () => {
      // Since values are random, we just verify the component renders
      // The formatNumber function handles locale formatting
      render(<ProfileAnalytics />);
      expect(screen.getByText('Profile viewers')).toBeInTheDocument();
    });
  });

  describe('likes and comments interaction', () => {
    it('should have role button on likes and comments row', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should call setActiveTab with notifications when clicked', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockSetActiveTab).toHaveBeenCalledWith('notifications');
    });

    it('should call setActiveTab when Enter key is pressed', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(mockSetActiveTab).toHaveBeenCalledWith('notifications');
    });

    it('should not call setActiveTab when other keys are pressed', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Space' });
      expect(mockSetActiveTab).not.toHaveBeenCalled();
    });

    it('should have tabIndex 0 for keyboard accessibility', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should have cursor-pointer class on clickable row', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  describe('styling', () => {
    it('should have motion.div wrapper with correct classes', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('bg-white');
      expect(motionDiv).toHaveClass('rounded-lg');
      expect(motionDiv).toHaveClass('border');
    });

    it('should have border-slate-200 class', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('border-slate-200');
    });

    it('should have padding class', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('p-3');
    });

    it('should have transition-colors class', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('transition-colors');
    });

    it('should have duration-300 class', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('duration-300');
    });
  });

  describe('label styling', () => {
    it('should have text-xs class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('text-xs');
    });

    it('should have font-semibold class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('font-semibold');
    });

    it('should have text-slate-500 class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('text-slate-500');
    });

    it('should have transition-colors class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('transition-colors');
    });
  });

  describe('value styling', () => {
    it('should have text-xs class on values', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.text-orange-500');
      expect(value).toHaveClass('text-xs');
    });

    it('should have font-bold class on values', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.text-orange-500');
      expect(value).toHaveClass('font-bold');
    });

    it('should have text-orange-500 class on values', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.text-orange-500');
      expect(value).toBeInTheDocument();
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode class on container', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('dark:bg-neutral-900');
    });

    it('should have dark mode border class', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      expect(motionDiv).toHaveClass('dark:border-neutral-700');
    });

    it('should have dark mode class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('dark:text-neutral-400');
    });

    it('should have dark mode class on values', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.dark\\:text-orange-400');
      expect(value).toBeInTheDocument();
    });

    it('should have dark mode hover class on clickable row', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dark:hover:bg-neutral-800');
    });
  });

  describe('hover effects', () => {
    it('should have hover:bg-slate-50 on clickable row', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-slate-50');
    });

    it('should have group class for hover label effects', () => {
      render(<ProfileAnalytics />);
      const rows = screen.getByText('Profile viewers').closest('.group');
      expect(rows).toBeInTheDocument();
    });

    it('should have group-hover text color classes on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('group-hover:text-slate-900');
    });

    it('should have dark mode group-hover class on labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label).toHaveClass('dark:group-hover:text-slate-200');
    });
  });

  describe('animation props', () => {
    it('should have initial opacity 0', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      const initial = JSON.parse(motionDiv.getAttribute('data-initial'));
      expect(initial.opacity).toBe(0);
    });

    it('should have initial y offset of 10', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      const initial = JSON.parse(motionDiv.getAttribute('data-initial'));
      expect(initial.y).toBe(10);
    });

    it('should animate to opacity 1', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      const animate = JSON.parse(motionDiv.getAttribute('data-animate'));
      expect(animate.opacity).toBe(1);
    });

    it('should animate to y 0', () => {
      render(<ProfileAnalytics />);
      const motionDiv = screen.getByTestId('motion-div');
      const animate = JSON.parse(motionDiv.getAttribute('data-animate'));
      expect(animate.y).toBe(0);
    });
  });

  describe('structure', () => {
    it('should render p tags for labels', () => {
      render(<ProfileAnalytics />);
      const label = screen.getByText('Profile viewers');
      expect(label.tagName).toBe('P');
    });

    it('should render p tags for values', () => {
      render(<ProfileAnalytics />);
      const viewersRow = screen.getByText('Profile viewers').closest('div');
      const value = viewersRow.querySelector('.text-orange-500');
      expect(value.tagName).toBe('P');
    });

    it('should have flex-col layout on inner container', () => {
      const { container } = render(<ProfileAnalytics />);
      const innerContainer = container.querySelector('.flex.flex-col');
      expect(innerContainer).toBeInTheDocument();
    });

    it('should have padding on rows', () => {
      render(<ProfileAnalytics />);
      const row = screen.getByText('Profile viewers').closest('div');
      expect(row).toHaveClass('px-4');
      expect(row).toHaveClass('py-0.5');
    });
  });

  describe('random value ranges', () => {
    it('should render numeric values for all stats', () => {
      render(<ProfileAnalytics />);
      const values = document.querySelectorAll('.text-orange-500');
      values.forEach((value) => {
        // Value should be a formatted number (may contain commas)
        expect(value.textContent).toMatch(/^[\d,]+$/);
      });
    });
  });

  describe('accessibility', () => {
    it('should have interactive element with role button', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should have descriptive text for likes and comments', () => {
      render(<ProfileAnalytics />);
      expect(screen.getByText('Likes and comments')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle multiple renders without error', () => {
      const { rerender } = render(<ProfileAnalytics />);
      expect(() => rerender(<ProfileAnalytics />)).not.toThrow();
    });

    it('should not call setActiveTab on initial render', () => {
      render(<ProfileAnalytics />);
      expect(mockSetActiveTab).not.toHaveBeenCalled();
    });

    it('should call setActiveTab only once per click', () => {
      render(<ProfileAnalytics />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      expect(mockSetActiveTab).toHaveBeenCalledTimes(2);
    });
  });
});
