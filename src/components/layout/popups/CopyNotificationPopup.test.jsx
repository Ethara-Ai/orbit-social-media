/**
 * Unit Tests for CopyNotificationPopup Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CopyNotificationPopup from './CopyNotificationPopup';

// Mock the focused UI context hook
vi.mock('../../../context/providers/ui', () => ({
  useNotificationPopup: () => ({
    showCopyNotification: true,
    copyNotificationMessage: 'Link copied to clipboard!',
  }),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, animate, exit, ...props }) => (
      <div
        className={className}
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-exit={JSON.stringify(exit)}
        {...props}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('CopyNotificationPopup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component when visible', () => {
      render(<CopyNotificationPopup />);
      expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
    });

    it('should render the success message', () => {
      render(<CopyNotificationPopup />);
      expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
    });

    it('should render the checkmark icon', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render the motion container', () => {
      render(<CopyNotificationPopup />);
      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });
  });

  describe('icon styling', () => {
    it('should have w-5 h-5 size classes on icon', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-5');
      expect(svg).toHaveClass('h-5');
    });

    it('should have text-emerald-400 color class on icon', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-emerald-400');
    });

    it('should have fill none attribute', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should have stroke currentColor attribute', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should have viewBox attribute', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have path element with correct attributes', () => {
      const { container } = render(<CopyNotificationPopup />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('stroke-linecap', 'round');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });
  });

  describe('container styling', () => {
    it('should have fixed positioning', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('fixed');
    });

    it('should have bottom-6 position class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('bottom-6');
    });

    it('should have left-1/2 position class for centering', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('left-1/2');
    });

    it('should have -translate-x-1/2 for horizontal centering', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('-translate-x-1/2');
    });

    it('should have bg-slate-900 background class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('bg-slate-900');
    });

    it('should have text-white class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('text-white');
    });

    it('should have horizontal padding px-5', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('px-5');
    });

    it('should have vertical padding py-3', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('py-3');
    });

    it('should have rounded-xl border radius', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('rounded-xl');
    });

    it('should have shadow-2xl class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('shadow-2xl');
    });

    it('should have z-50 class for proper layering', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('z-50');
    });

    it('should have flex layout', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('flex');
    });

    it('should have items-center class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('items-center');
    });

    it('should have gap-2 class', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('gap-2');
    });
  });

  describe('animation props', () => {
    it('should have initial opacity 0', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const initial = JSON.parse(popup.getAttribute('data-initial'));
      expect(initial.opacity).toBe(0);
    });

    it('should have initial y 50 for slide-up animation', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const initial = JSON.parse(popup.getAttribute('data-initial'));
      expect(initial.y).toBe(50);
    });

    it('should animate to opacity 1', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const animate = JSON.parse(popup.getAttribute('data-animate'));
      expect(animate.opacity).toBe(1);
    });

    it('should animate to y 0', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const animate = JSON.parse(popup.getAttribute('data-animate'));
      expect(animate.y).toBe(0);
    });

    it('should have exit opacity 0', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const exit = JSON.parse(popup.getAttribute('data-exit'));
      expect(exit.opacity).toBe(0);
    });

    it('should have exit y 50 for slide-down animation', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const exit = JSON.parse(popup.getAttribute('data-exit'));
      expect(exit.y).toBe(50);
    });
  });

  describe('structure', () => {
    it('should contain svg and text content', () => {
      const { container } = render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toContainElement(container.querySelector('svg'));
      expect(popup).toHaveTextContent('Link copied to clipboard!');
    });

    it('should have svg before text content', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      const firstChild = popup.firstChild;
      expect(firstChild.tagName).toBe('svg');
    });
  });

  describe('accessibility', () => {
    it('should have visible text for screen readers', () => {
      render(<CopyNotificationPopup />);
      expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
    });

    it('should render as a toast notification at the bottom of viewport', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('fixed');
      expect(popup).toHaveClass('bottom-6');
    });
  });

  describe('visual feedback', () => {
    it('should use emerald color for success indication', () => {
      const { container } = render(<CopyNotificationPopup />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-emerald-400');
    });

    it('should use dark background for contrast', () => {
      render(<CopyNotificationPopup />);
      const popup = screen.getByTestId('motion-div');
      expect(popup).toHaveClass('bg-slate-900');
      expect(popup).toHaveClass('text-white');
    });
  });

  describe('edge cases', () => {
    it('should handle multiple renders without error', () => {
      const { rerender } = render(<CopyNotificationPopup />);
      expect(() => rerender(<CopyNotificationPopup />)).not.toThrow();
    });

    it('should display the message from context', () => {
      render(<CopyNotificationPopup />);
      expect(screen.getByText('Link copied to clipboard!')).toBeInTheDocument();
    });
  });
});

describe('CopyNotificationPopup visibility states', () => {
  it('should document that popup shows based on showCopyNotification context value', () => {
    // This test documents the expected behavior:
    // The popup visibility is controlled by the showCopyNotification value from useNotificationPopup context
    // When showCopyNotification is true, the popup renders
    // When showCopyNotification is false, the popup does not render (via AnimatePresence)
    render(<CopyNotificationPopup />);
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });
});
