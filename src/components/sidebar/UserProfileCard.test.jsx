/**
 * Unit Tests for UserProfileCard Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfileCard from './UserProfileCard';

// Mock Avatar component
vi.mock('../common/Avatar', () => ({
  default: ({ src, alt, size, isOnline, showStatus, ring }) => (
    <img
      src={src}
      alt={alt}
      data-testid="avatar"
      data-size={size}
      data-is-online={isOnline}
      data-show-status={showStatus}
      data-ring={ring}
    />
  ),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, whileHover, whileTap, ...props }) => (
      <div
        className={className}
        onClick={onClick}
        data-testid="motion-div"
        data-while-hover={whileHover ? 'true' : 'false'}
        data-while-tap={whileTap ? 'true' : 'false'}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

describe('UserProfileCard', () => {
  const mockUser = {
    name: 'John Doe',
    profession: 'Software Engineer',
  };

  const mockAvatar = 'https://example.com/avatar.jpg';

  const defaultProps = {
    user: mockUser,
    avatar: mockAvatar,
  };

  describe('rendering', () => {
    it('should render the component', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user name', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user profession', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });

    it('should render avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('should render all three stat items', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('Posts')).toBeInTheDocument();
      expect(screen.getByText('Followers')).toBeInTheDocument();
      expect(screen.getByText('Following')).toBeInTheDocument();
    });
  });

  describe('avatar props', () => {
    it('should pass correct src to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should pass correct alt to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('alt', 'John Doe');
    });

    it('should pass xl size to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-size', 'xl');
    });

    it('should pass isOnline as true to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-is-online', 'true');
    });

    it('should pass showStatus as true to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-show-status', 'true');
    });

    it('should pass ring as false to avatar', () => {
      render(<UserProfileCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-ring', 'false');
    });
  });

  describe('default stats', () => {
    it('should display default posts count', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('142')).toBeInTheDocument();
    });

    it('should display default followers count', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('24.7K')).toBeInTheDocument();
    });

    it('should display default following count', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByText('318')).toBeInTheDocument();
    });
  });

  describe('custom stats', () => {
    it('should display custom posts count', () => {
      const customStats = { posts: 500, followers: '10K', following: 200 };
      render(<UserProfileCard {...defaultProps} stats={customStats} />);
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should display custom followers count', () => {
      const customStats = { posts: 500, followers: '10K', following: 200 };
      render(<UserProfileCard {...defaultProps} stats={customStats} />);
      expect(screen.getByText('10K')).toBeInTheDocument();
    });

    it('should display custom following count', () => {
      const customStats = { posts: 500, followers: '10K', following: 200 };
      render(<UserProfileCard {...defaultProps} stats={customStats} />);
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should handle numeric followers', () => {
      const customStats = { posts: 100, followers: 5000, following: 300 };
      render(<UserProfileCard {...defaultProps} stats={customStats} />);
      expect(screen.getByText('5000')).toBeInTheDocument();
    });
  });

  describe('click handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<UserProfileCard {...defaultProps} onClick={handleClick} />);
      const card = screen.getByTestId('motion-div');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have cursor-pointer class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<UserProfileCard {...defaultProps} onClick={handleClick} />);
      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should have cursor-default class when onClick is not provided', () => {
      render(<UserProfileCard {...defaultProps} />);
      const card = screen.getByTestId('motion-div');
      expect(card).toHaveClass('cursor-default');
    });

    it('should not throw when clicked without onClick handler', () => {
      render(<UserProfileCard {...defaultProps} />);
      const card = screen.getByTestId('motion-div');
      expect(() => fireEvent.click(card)).not.toThrow();
    });
  });

  describe('animation props', () => {
    it('should have whileHover when onClick is provided and animated is true', () => {
      const handleClick = vi.fn();
      render(<UserProfileCard {...defaultProps} onClick={handleClick} animated={true} />);
      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-while-hover', 'true');
    });

    it('should have whileTap when onClick is provided and animated is true', () => {
      const handleClick = vi.fn();
      render(<UserProfileCard {...defaultProps} onClick={handleClick} animated={true} />);
      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-while-tap', 'true');
    });

    it('should not have whileHover when onClick is not provided', () => {
      render(<UserProfileCard {...defaultProps} animated={true} />);
      const card = screen.getByTestId('motion-div');
      expect(card).toHaveAttribute('data-while-hover', 'false');
    });

    it('should render motion.div when animated is true', () => {
      render(<UserProfileCard {...defaultProps} animated={true} />);
      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });

    it('should default animated to true', () => {
      render(<UserProfileCard {...defaultProps} />);
      expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    });
  });

  describe('non-animated mode', () => {
    it('should render regular div when animated is false', () => {
      const { container } = render(<UserProfileCard {...defaultProps} animated={false} />);
      // When animated is false, it renders a regular div without data-testid
      const card = container.firstChild;
      expect(card).toBeInTheDocument();
    });

    it('should still call onClick when animated is false', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <UserProfileCard {...defaultProps} onClick={handleClick} animated={false} />
      );
      const card = container.firstChild;
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('structure', () => {
    it('should render h2 tag for user name', () => {
      render(<UserProfileCard {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('John Doe');
    });

    it('should render p tag for profession', () => {
      render(<UserProfileCard {...defaultProps} />);
      const profession = screen.getByText('Software Engineer');
      expect(profession.tagName).toBe('P');
    });

    it('should have stats section with border-t', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />);
      const statsSection = container.querySelector('.border-t');
      expect(statsSection).toBeInTheDocument();
    });
  });

  describe('user name styling', () => {
    it('should have text-sm class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('text-sm');
    });

    it('should have font-semibold class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('font-semibold');
    });

    it('should have text-slate-900 class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('text-slate-900');
    });

    it('should have margin-top class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('mt-2.5');
    });
  });

  describe('profession styling', () => {
    it('should have text-xs class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const profession = screen.getByText('Software Engineer');
      expect(profession).toHaveClass('text-xs');
    });

    it('should have text-slate-500 class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const profession = screen.getByText('Software Engineer');
      expect(profession).toHaveClass('text-slate-500');
    });

    it('should have margin-top class', () => {
      render(<UserProfileCard {...defaultProps} />);
      const profession = screen.getByText('Software Engineer');
      expect(profession).toHaveClass('mt-0.5');
    });
  });

  describe('stats styling', () => {
    it('should have stat value with font-bold', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statValue = screen.getByText('142');
      expect(statValue).toHaveClass('font-bold');
    });

    it('should have stat value with text-slate-900', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statValue = screen.getByText('142');
      expect(statValue).toHaveClass('text-slate-900');
    });

    it('should have stat label with text-xs', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statLabel = screen.getByText('Posts');
      expect(statLabel).toHaveClass('text-xs');
    });

    it('should have stat label with text-slate-500', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statLabel = screen.getByText('Posts');
      expect(statLabel).toHaveClass('text-slate-500');
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode class on user name', () => {
      render(<UserProfileCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('dark:text-white');
    });

    it('should have dark mode class on profession', () => {
      render(<UserProfileCard {...defaultProps} />);
      const profession = screen.getByText('Software Engineer');
      expect(profession).toHaveClass('dark:text-neutral-400');
    });

    it('should have dark mode class on stats border', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />);
      const statsSection = container.querySelector('.dark\\:border-slate-700');
      expect(statsSection).toBeInTheDocument();
    });

    it('should have dark mode class on stat values', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statValue = screen.getByText('142');
      expect(statValue).toHaveClass('dark:text-white');
    });

    it('should have dark mode class on stat labels', () => {
      render(<UserProfileCard {...defaultProps} />);
      const statLabel = screen.getByText('Posts');
      expect(statLabel).toHaveClass('dark:text-neutral-400');
    });
  });

  describe('layout', () => {
    it('should have centered user info section', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />);
      const userSection = container.querySelector('.flex.flex-col.items-center');
      expect(userSection).toBeInTheDocument();
    });

    it('should have text-center on user info section', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />);
      const userSection = container.querySelector('.text-center');
      expect(userSection).toBeInTheDocument();
    });

    it('should have flex justify-between on stats', () => {
      const { container } = render(<UserProfileCard {...defaultProps} />);
      const statsRow = container.querySelector('.flex.justify-between');
      expect(statsRow).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle long user name', () => {
      const longNameUser = {
        name: 'This Is A Very Long User Name',
        profession: 'Engineer',
      };
      render(<UserProfileCard {...defaultProps} user={longNameUser} />);
      expect(screen.getByText('This Is A Very Long User Name')).toBeInTheDocument();
    });

    it('should handle long profession', () => {
      const longProfessionUser = {
        name: 'John',
        profession: 'Senior Principal Staff Software Engineer Lead',
      };
      render(<UserProfileCard {...defaultProps} user={longProfessionUser} />);
      expect(screen.getByText('Senior Principal Staff Software Engineer Lead')).toBeInTheDocument();
    });

    it('should handle empty profession', () => {
      const noProfessionUser = {
        name: 'John',
        profession: '',
      };
      render(<UserProfileCard {...defaultProps} user={noProfessionUser} />);
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('should handle special characters in name', () => {
      const specialCharUser = {
        name: 'John & Jane <Doe>',
        profession: 'Engineer',
      };
      render(<UserProfileCard {...defaultProps} user={specialCharUser} />);
      expect(screen.getByText('John & Jane <Doe>')).toBeInTheDocument();
    });

    it('should handle zero stats', () => {
      const zeroStats = { posts: 0, followers: 0, following: 0 };
      render(<UserProfileCard {...defaultProps} stats={zeroStats} />);
      expect(screen.getAllByText('0')).toHaveLength(3);
    });

    it('should handle large numbers in stats', () => {
      const largeStats = { posts: 999999, followers: '1.5M', following: 50000 };
      render(<UserProfileCard {...defaultProps} stats={largeStats} />);
      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByText('1.5M')).toBeInTheDocument();
      expect(screen.getByText('50000')).toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('should handle all props together correctly', () => {
      const handleClick = vi.fn();
      const customStats = { posts: 100, followers: '5K', following: 250 };
      const customUser = { name: 'Jane Smith', profession: 'Designer' };

      render(
        <UserProfileCard
          user={customUser}
          avatar="https://example.com/jane.jpg"
          onClick={handleClick}
          stats={customStats}
          animated={true}
        />
      );

      // Check user info
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Designer')).toBeInTheDocument();

      // Check avatar
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('src', 'https://example.com/jane.jpg');

      // Check stats
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('5K')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();

      // Check click
      const card = screen.getByTestId('motion-div');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
