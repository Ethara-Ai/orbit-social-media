/**
 * Unit Tests for Avatar Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  const defaultProps = {
    src: 'https://example.com/avatar.jpg',
    alt: 'Test User',
  };

  describe('rendering', () => {
    it('should render an image element', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
    });

    it('should render with the provided src', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', defaultProps.src);
    });

    it('should render with the provided alt text', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', defaultProps.alt);
    });

    it('should use default alt text when not provided', () => {
      render(<Avatar src={defaultProps.src} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'User avatar');
    });

    it('should use placeholder src when src is not provided', () => {
      render(<Avatar alt="Test" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', '/placeholder.svg');
    });
  });

  describe('sizes', () => {
    it('should apply medium size classes by default', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-9');
      expect(img).toHaveClass('h-9');
    });

    it('should apply extra small size classes', () => {
      render(<Avatar {...defaultProps} size="xs" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-4');
      expect(img).toHaveClass('h-4');
    });

    it('should apply small size classes', () => {
      render(<Avatar {...defaultProps} size="sm" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-7');
      expect(img).toHaveClass('h-7');
    });

    it('should apply large size classes', () => {
      render(<Avatar {...defaultProps} size="lg" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-10');
      expect(img).toHaveClass('h-10');
    });

    it('should apply extra large size classes', () => {
      render(<Avatar {...defaultProps} size="xl" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-11');
      expect(img).toHaveClass('h-11');
    });

    it('should apply 2xl size classes', () => {
      render(<Avatar {...defaultProps} size="2xl" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('w-12');
      expect(img).toHaveClass('h-12');
    });
  });

  describe('ring-3 styles', () => {
    it('should not have ring-3 classes by default', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).not.toHaveClass('ring-2');
    });

    it('should apply ring-3 classes when ring-3 is true', () => {
      render(<Avatar {...defaultProps} ring={true} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('ring-2');
      expect(img).toHaveClass('shadow-md');
    });

    it('should apply white ring-3 color by default', () => {
      render(<Avatar {...defaultProps} ring={true} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('ring-white');
    });

    it('should apply slate ring-3 color', () => {
      render(<Avatar {...defaultProps} ring={true} ringColor="slate" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('ring-slate-100');
    });

    it('should apply orange ring-3 color', () => {
      render(<Avatar {...defaultProps} ring={true} ringColor="orange" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('ring-orange-500/50');
    });
  });

  describe('online status indicator', () => {
    it('should not show status indicator by default', () => {
      const { container } = render(<Avatar {...defaultProps} isOnline={true} />);
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).not.toBeInTheDocument();
    });

    it('should not show status indicator when showStatus is true but isOnline is false', () => {
      const { container } = render(<Avatar {...defaultProps} showStatus={true} isOnline={false} />);
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).not.toBeInTheDocument();
    });

    it('should show status indicator when showStatus and isOnline are true', () => {
      const { container } = render(<Avatar {...defaultProps} showStatus={true} isOnline={true} />);
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).toBeInTheDocument();
    });

    it('should apply correct status size classes for sm avatar', () => {
      const { container } = render(
        <Avatar {...defaultProps} size="sm" showStatus={true} isOnline={true} />
      );
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).toHaveClass('w-2');
      expect(statusIndicator).toHaveClass('h-2');
    });

    it('should apply correct status size classes for lg avatar', () => {
      const { container } = render(
        <Avatar {...defaultProps} size="lg" showStatus={true} isOnline={true} />
      );
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).toHaveClass('w-3');
      expect(statusIndicator).toHaveClass('h-3');
    });

    it('should position status indicator at bottom-right', () => {
      const { container } = render(<Avatar {...defaultProps} showStatus={true} isOnline={true} />);
      const statusIndicator = container.querySelector('.bg-emerald-400');
      expect(statusIndicator).toHaveClass('-bottom-0.5');
      expect(statusIndicator).toHaveClass('-right-0.5');
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Avatar {...defaultProps} onClick={handleClick} />);
      const container = screen.getByRole('img').parentElement;
      fireEvent.click(container);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have cursor-pointer class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<Avatar {...defaultProps} onClick={handleClick} />);
      const container = screen.getByRole('img').parentElement;
      expect(container).toHaveClass('cursor-pointer');
    });

    it('should not have cursor-pointer class when onClick is not provided', () => {
      render(<Avatar {...defaultProps} />);
      const container = screen.getByRole('img').parentElement;
      expect(container).not.toHaveClass('cursor-pointer');
    });
  });

  describe('image error handling', () => {
    it('should set fallback image on error', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');

      fireEvent.error(img);

      expect(img).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face'
      );
    });
  });

  describe('custom className', () => {
    it('should apply custom className to the image', () => {
      render(<Avatar {...defaultProps} className="custom-class" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<Avatar {...defaultProps} className="my-custom-avatar" />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('my-custom-avatar');
      expect(img).toHaveClass('rounded-full');
      expect(img).toHaveClass('object-cover');
    });
  });

  describe('base classes', () => {
    it('should always have rounded-full class', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('rounded-full');
    });

    it('should always have object-cover class', () => {
      render(<Avatar {...defaultProps} />);
      const img = screen.getByRole('img');
      expect(img).toHaveClass('object-cover');
    });

    it('should have shrink-0 on the container', () => {
      render(<Avatar {...defaultProps} />);
      const container = screen.getByRole('img').parentElement;
      expect(container).toHaveClass('shrink-0');
    });

    it('should have relative positioning on the container', () => {
      render(<Avatar {...defaultProps} />);
      const container = screen.getByRole('img').parentElement;
      expect(container).toHaveClass('relative');
    });
  });

  describe('combined props', () => {
    it('should handle all props together correctly', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Avatar
          src="https://example.com/user.jpg"
          alt="John Doe"
          size="lg"
          isOnline={true}
          showStatus={true}
          className="extra-styles"
          onClick={handleClick}
          ring={true}
          ringColor="orange"
        />
      );

      const img = screen.getByRole('img');
      const statusIndicator = container.querySelector('.bg-emerald-400');
      const avatarContainer = img.parentElement;

      // Check image props
      expect(img).toHaveAttribute('src', 'https://example.com/user.jpg');
      expect(img).toHaveAttribute('alt', 'John Doe');

      // Check size
      expect(img).toHaveClass('w-10');
      expect(img).toHaveClass('h-10');

      // Check ring
      expect(img).toHaveClass('ring-2');
      expect(img).toHaveClass('ring-orange-500/50');

      // Check custom class
      expect(img).toHaveClass('extra-styles');

      // Check status indicator
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveClass('w-3');

      // Check click handler
      fireEvent.click(avatarContainer);
      expect(handleClick).toHaveBeenCalled();
    });

    it('should render correctly with minimal props', () => {
      render(<Avatar />);
      const img = screen.getByRole('img');

      expect(img).toHaveAttribute('src', '/placeholder.svg');
      expect(img).toHaveAttribute('alt', 'User avatar');
      expect(img).toHaveClass('w-9');
      expect(img).toHaveClass('h-9');
      expect(img).toHaveClass('rounded-full');
    });
  });
});
