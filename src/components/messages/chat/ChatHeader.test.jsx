/**
 * Unit Tests for ChatHeader Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatHeader from './ChatHeader';

// Mock Avatar component
vi.mock('../../common/Avatar', () => ({
  default: ({ src, alt, size, isOnline, showStatus, className }) => (
    <img
      src={src}
      alt={alt}
      data-testid="avatar"
      data-size={size}
      data-is-online={isOnline}
      data-show-status={showStatus}
      className={className}
    />
  ),
}));

// Mock icons
vi.mock('../../icons', () => ({
  MoreHorizontal: ({ className }) => (
    <svg data-testid="more-horizontal-icon" className={className} />
  ),
  X: ({ className }) => <svg data-testid="x-icon" className={className} />,
}));

describe('ChatHeader', () => {
  const mockConversation = {
    user: {
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
      isOnline: true,
      lastSeen: '2 hours ago',
    },
  };

  const defaultProps = {
    conversation: mockConversation,
    onBack: vi.fn(),
    showDropdown: false,
    setShowDropdown: vi.fn(),
    onClearChat: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user name', () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should render more options button', () => {
      render(<ChatHeader {...defaultProps} />);
      const moreIcon = screen.getByTestId('more-horizontal-icon');
      expect(moreIcon).toBeInTheDocument();
    });

    it('should render back button for mobile', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const backButton = container.querySelector('.sm\\:hidden');
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('avatar props', () => {
    it('should pass correct src to avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should pass correct alt to avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('alt', 'John Doe');
    });

    it('should pass md size to avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-size', 'md');
    });

    it('should pass isOnline prop to avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-is-online', 'true');
    });

    it('should pass showStatus as true to avatar', () => {
      render(<ChatHeader {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-show-status', 'true');
    });
  });

  describe('online status display', () => {
    it('should display Online when user is online', () => {
      render(<ChatHeader {...defaultProps} />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should display last seen when user is offline', () => {
      const offlineConversation = {
        user: {
          ...mockConversation.user,
          isOnline: false,
          lastSeen: '5 minutes ago',
        },
      };
      render(<ChatHeader {...defaultProps} conversation={offlineConversation} />);
      expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    });

    it('should not display Online when user is offline', () => {
      const offlineConversation = {
        user: {
          ...mockConversation.user,
          isOnline: false,
          lastSeen: 'Yesterday',
        },
      };
      render(<ChatHeader {...defaultProps} conversation={offlineConversation} />);
      expect(screen.queryByText('Online')).not.toBeInTheDocument();
    });
  });

  describe('back button', () => {
    it('should call onBack when back button is clicked', () => {
      const onBack = vi.fn();
      const { container } = render(<ChatHeader {...defaultProps} onBack={onBack} />);
      const backButton = container.querySelector('.sm\\:hidden');
      fireEvent.click(backButton);
      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('should have hidden class on larger screens', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const backButton = container.querySelector('button.sm\\:hidden');
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('dropdown menu', () => {
    it('should call setShowDropdown when more button is clicked', () => {
      const setShowDropdown = vi.fn();
      render(<ChatHeader {...defaultProps} setShowDropdown={setShowDropdown} />);
      const moreButton = screen.getByTestId('more-horizontal-icon').parentElement;
      fireEvent.click(moreButton);
      expect(setShowDropdown).toHaveBeenCalled();
    });

    it('should toggle showDropdown value', () => {
      const setShowDropdown = vi.fn();
      render(
        <ChatHeader {...defaultProps} showDropdown={false} setShowDropdown={setShowDropdown} />
      );
      const moreButton = screen.getByTestId('more-horizontal-icon').parentElement;
      fireEvent.click(moreButton);
      expect(setShowDropdown).toHaveBeenCalledWith(true);
    });

    it('should not show dropdown content when showDropdown is false', () => {
      render(<ChatHeader {...defaultProps} showDropdown={false} />);
      expect(screen.queryByText('Clear chat')).not.toBeInTheDocument();
    });

    it('should show dropdown content when showDropdown is true', () => {
      render(<ChatHeader {...defaultProps} showDropdown={true} />);
      expect(screen.getByText('Clear chat')).toBeInTheDocument();
    });

    it('should render X icon in clear chat button', () => {
      render(<ChatHeader {...defaultProps} showDropdown={true} />);
      const xIcon = screen.getByTestId('x-icon');
      expect(xIcon).toBeInTheDocument();
    });
  });

  describe('clear chat functionality', () => {
    it('should call onClearChat when Clear chat is clicked', () => {
      const onClearChat = vi.fn();
      render(<ChatHeader {...defaultProps} showDropdown={true} onClearChat={onClearChat} />);
      const clearButton = screen.getByText('Clear chat').closest('button');
      fireEvent.click(clearButton);
      expect(onClearChat).toHaveBeenCalledTimes(1);
    });
  });

  describe('styling', () => {
    it('should have border-b class on container', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('border-b');
    });

    it('should have flex layout classes', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('items-center');
    });

    it('should have background color classes', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('bg-white');
    });

    it('should have transition-colors class', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('transition-colors');
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('p-2');
      expect(header).toHaveClass('sm:p-4');
    });
  });

  describe('user name styling', () => {
    it('should have font-semibold class', () => {
      render(<ChatHeader {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('font-semibold');
    });

    it('should have truncate class for overflow', () => {
      render(<ChatHeader {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('truncate');
    });

    it('should have transition-colors class', () => {
      render(<ChatHeader {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('transition-colors');
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode class on container', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('dark:bg-neutral-900');
    });

    it('should have dark mode class on user name', () => {
      render(<ChatHeader {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('dark:text-white');
    });

    it('should have dark mode class on border', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('dark:border-neutral-700');
    });
  });

  describe('structure', () => {
    it('should render h3 tag for user name', () => {
      render(<ChatHeader {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('John Doe');
    });

    it('should render p tag for status', () => {
      render(<ChatHeader {...defaultProps} />);
      const status = screen.getByText('Online');
      expect(status.tagName).toBe('P');
    });

    it('should have dropdown container with relative positioning', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const dropdownContainer = container.querySelector('.relative');
      expect(dropdownContainer).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle long user name with truncate', () => {
      const longNameConversation = {
        user: {
          ...mockConversation.user,
          name: 'This Is A Very Long User Name That Should Be Truncated',
        },
      };
      render(<ChatHeader {...defaultProps} conversation={longNameConversation} />);
      const userName = screen.getByText('This Is A Very Long User Name That Should Be Truncated');
      expect(userName).toHaveClass('truncate');
    });

    it('should handle missing avatar gracefully', () => {
      const noAvatarConversation = {
        user: {
          ...mockConversation.user,
          avatar: '',
        },
      };
      expect(() => {
        render(<ChatHeader {...defaultProps} conversation={noAvatarConversation} />);
      }).not.toThrow();
    });

    it('should handle undefined lastSeen when offline', () => {
      const noLastSeenConversation = {
        user: {
          name: 'John Doe',
          avatar: 'https://example.com/avatar.jpg',
          isOnline: false,
          lastSeen: undefined,
        },
      };
      expect(() => {
        render(<ChatHeader {...defaultProps} conversation={noLastSeenConversation} />);
      }).not.toThrow();
    });
  });

  describe('responsive behavior', () => {
    it('should have responsive gap classes', () => {
      const { container } = render(<ChatHeader {...defaultProps} />);
      const header = container.firstChild;
      expect(header).toHaveClass('gap-2');
      expect(header).toHaveClass('sm:gap-3');
    });

    it('should have responsive text sizes for user name', () => {
      render(<ChatHeader {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('text-xs');
      expect(userName).toHaveClass('sm:text-sm');
    });
  });

  describe('dropdown styling', () => {
    it('should have absolute positioning when open', () => {
      const { container } = render(<ChatHeader {...defaultProps} showDropdown={true} />);
      const dropdown = container.querySelector('.absolute.right-0');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have shadow and border on dropdown', () => {
      const { container } = render(<ChatHeader {...defaultProps} showDropdown={true} />);
      const dropdown = container.querySelector('.shadow-lg');
      expect(dropdown).toBeInTheDocument();
    });

    it('should have z-50 on dropdown for proper layering', () => {
      const { container } = render(<ChatHeader {...defaultProps} showDropdown={true} />);
      const dropdown = container.querySelector('.z-50');
      expect(dropdown).toBeInTheDocument();
    });
  });
});
