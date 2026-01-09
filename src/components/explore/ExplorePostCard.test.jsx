/**
 * Unit Tests for ExplorePostCard Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExplorePostCard from './ExplorePostCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, className, onClick }) => (
      <article className={className} onClick={onClick} data-testid="post-card">
        {children}
      </article>
    ),
  },
}));

// Mock Avatar component
vi.mock('../common/Avatar', () => ({
  default: ({ src, alt, size }) => (
    <img src={src} alt={alt} data-testid="avatar" data-size={size} />
  ),
}));

// Mock icons
vi.mock('../icons', () => ({
  Heart: ({ className }) => (
    <svg data-testid="heart-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
  Zap: ({ className }) => (
    <svg data-testid="zap-icon" className={className}>
      <path d="M0 0" />
    </svg>
  ),
}));

describe('ExplorePostCard', () => {
  const mockPost = {
    id: 'post-1',
    title: 'Amazing Technology Post',
    image: 'https://example.com/image.jpg',
    likes: 1234,
    isLiked: false,
    isNew: false,
    user: {
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
  };

  const defaultProps = {
    post: mockPost,
    index: 0,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByTestId('post-card')).toBeInTheDocument();
    });

    it('should render post title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByText('Amazing Technology Post')).toBeInTheDocument();
    });

    it('should render user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render user avatar', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should render post image', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render likes count in hover overlay', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render heart icon in hover overlay', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
    });
  });

  describe('new badge', () => {
    it('should show new badge when post isNew is true', () => {
      const newPost = { ...mockPost, isNew: true };
      render(<ExplorePostCard {...defaultProps} post={newPost} />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should render zap icon in new badge', () => {
      const newPost = { ...mockPost, isNew: true };
      render(<ExplorePostCard {...defaultProps} post={newPost} />);
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument();
    });

    it('should not show new badge when post isNew is false', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });

    it('should not render zap icon when post is not new', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.queryByTestId('zap-icon')).not.toBeInTheDocument();
    });
  });

  describe('liked state', () => {
    it('should have fill-current class on heart when liked', () => {
      const likedPost = { ...mockPost, isLiked: true };
      render(<ExplorePostCard {...defaultProps} post={likedPost} />);
      const heartIcon = screen.getByTestId('heart-icon');
      expect(heartIcon).toHaveClass('fill-current');
    });

    it('should not have fill-current class on heart when not liked', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const heartIcon = screen.getByTestId('heart-icon');
      expect(heartIcon).not.toHaveClass('fill-current');
    });
  });

  describe('click handling', () => {
    it('should call onClick with post when clicked', () => {
      const onClick = vi.fn();
      render(<ExplorePostCard {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('post-card'));
      expect(onClick).toHaveBeenCalledWith(mockPost);
    });

    it('should call onClick only once per click', () => {
      const onClick = vi.fn();
      render(<ExplorePostCard {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('post-card'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple clicks', () => {
      const onClick = vi.fn();
      render(<ExplorePostCard {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('post-card'));
      fireEvent.click(screen.getByTestId('post-card'));
      fireEvent.click(screen.getByTestId('post-card'));

      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('image error handling', () => {
    it('should set fallback src on image error', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');

      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });

    it('should handle multiple error events', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');

      fireEvent.error(image);
      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });
  });

  describe('avatar', () => {
    it('should pass correct src to Avatar', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should pass correct alt to Avatar', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('alt', 'John Doe');
    });

    it('should pass xs size to Avatar', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-size', 'xs');
    });
  });

  describe('styling', () => {
    it('should have bg-white class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('bg-white');
    });

    it('should have dark:bg-slate-800 class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('dark:bg-slate-800');
    });

    it('should have rounded-xl class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('rounded-xl');
    });

    it('should have overflow-hidden class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('overflow-hidden');
    });

    it('should have cursor-pointer class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('should have group class for hover effects', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('group');
    });

    it('should have border class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('border');
    });

    it('should have transition-all class', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const card = screen.getByTestId('post-card');
      expect(card).toHaveClass('transition-all');
    });
  });

  describe('image styling', () => {
    it('should have w-full class on image', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toHaveClass('w-full');
    });

    it('should have h-full class on image', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toHaveClass('h-full');
    });

    it('should have object-cover class on image', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toHaveClass('object-cover');
    });

    it('should have transition-transform class on image', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toHaveClass('transition-transform');
    });
  });

  describe('title styling', () => {
    it('should have font-medium class on title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title).toHaveClass('font-medium');
    });

    it('should have text-slate-900 class on title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title).toHaveClass('text-slate-900');
    });

    it('should have text-xs class on title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title).toHaveClass('text-xs');
    });

    it('should have line-clamp-2 class on title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title).toHaveClass('line-clamp-2');
    });

    it('should have transition-colors class on title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title).toHaveClass('transition-colors');
    });
  });

  describe('user name styling', () => {
    it('should have text-xs class on user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('text-xs');
    });

    it('should have text-slate-500 class on user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('text-slate-500');
    });

    it('should have truncate class on user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('truncate');
    });

    it('should have transition-colors class on user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName).toHaveClass('transition-colors');
    });
  });

  describe('edge cases', () => {
    it('should handle long title', () => {
      const longTitlePost = {
        ...mockPost,
        title: 'This is a very long title that should be truncated with line-clamp-2 class',
      };
      render(<ExplorePostCard {...defaultProps} post={longTitlePost} />);
      expect(
        screen.getByText(
          'This is a very long title that should be truncated with line-clamp-2 class'
        )
      ).toBeInTheDocument();
    });

    it('should handle long user name', () => {
      const longNamePost = {
        ...mockPost,
        user: {
          ...mockPost.user,
          name: 'A Very Long User Name That Should Be Truncated',
        },
      };
      render(<ExplorePostCard {...defaultProps} post={longNamePost} />);
      expect(
        screen.getByText('A Very Long User Name That Should Be Truncated')
      ).toBeInTheDocument();
    });

    it('should handle zero likes', () => {
      const zeroLikesPost = { ...mockPost, likes: 0 };
      render(<ExplorePostCard {...defaultProps} post={zeroLikesPost} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle large number of likes', () => {
      const manyLikesPost = { ...mockPost, likes: 1000000 };
      render(<ExplorePostCard {...defaultProps} post={manyLikesPost} />);
      // toLocaleString format may vary by locale, so check for the formatted value
      expect(screen.getByText((1000000).toLocaleString())).toBeInTheDocument();
    });

    it('should handle missing image gracefully', () => {
      const noImagePost = { ...mockPost, image: '' };
      render(<ExplorePostCard {...defaultProps} post={noImagePost} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toHaveAttribute('src', '/placeholder.svg');
    });

    it('should handle special characters in title', () => {
      const specialPost = {
        ...mockPost,
        title: 'Tech & Design <Special> Post',
      };
      render(<ExplorePostCard {...defaultProps} post={specialPost} />);
      expect(screen.getByText('Tech & Design <Special> Post')).toBeInTheDocument();
    });

    it('should handle emoji in title', () => {
      const emojiPost = {
        ...mockPost,
        title: 'Amazing Post 🚀🔥',
      };
      render(<ExplorePostCard {...defaultProps} post={emojiPost} />);
      expect(screen.getByText('Amazing Post 🚀🔥')).toBeInTheDocument();
    });

    it('should handle different index values', () => {
      render(<ExplorePostCard {...defaultProps} index={100} />);
      expect(screen.getByTestId('post-card')).toBeInTheDocument();
    });
  });

  describe('image container', () => {
    it('should have aspect-square class on image container', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const imageContainer = container.querySelector('.aspect-square');
      expect(imageContainer).toBeInTheDocument();
    });

    it('should have overflow-hidden class on image container', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const imageContainer = container.querySelector('.aspect-square');
      expect(imageContainer).toHaveClass('overflow-hidden');
    });

    it('should have relative class on image container', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const imageContainer = container.querySelector('.aspect-square');
      expect(imageContainer).toHaveClass('relative');
    });
  });

  describe('content section', () => {
    it('should have p-3 padding on content section', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const contentSection = container.querySelector('.p-3');
      expect(contentSection).toBeInTheDocument();
    });
  });

  describe('hover overlay', () => {
    it('should have bg-black/40 class', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const overlay = container.querySelector('.bg-black\\/40');
      expect(overlay).toBeInTheDocument();
    });

    it('should have opacity-0 class (hidden by default)', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const overlay = container.querySelector('.opacity-0');
      expect(overlay).toBeInTheDocument();
    });

    it('should have group-hover:opacity-100 class', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const overlay = container.querySelector('.group-hover\\:opacity-100');
      expect(overlay).toBeInTheDocument();
    });

    it('should have transition-opacity class', () => {
      const { container } = render(<ExplorePostCard {...defaultProps} />);
      const overlay = container.querySelector('.transition-opacity');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('new badge styling', () => {
    it('should have bg-emerald-500 class on new badge', () => {
      const newPost = { ...mockPost, isNew: true };
      const { container } = render(<ExplorePostCard {...defaultProps} post={newPost} />);
      const badge = container.querySelector('.bg-emerald-500');
      expect(badge).toBeInTheDocument();
    });

    it('should have absolute positioning on new badge', () => {
      const newPost = { ...mockPost, isNew: true };
      const { container } = render(<ExplorePostCard {...defaultProps} post={newPost} />);
      const badge = container.querySelector('.absolute');
      expect(badge).toBeInTheDocument();
    });

    it('should have rounded-full class on new badge', () => {
      const newPost = { ...mockPost, isNew: true };
      const { container } = render(<ExplorePostCard {...defaultProps} post={newPost} />);
      const badge = container.querySelector('.rounded-full');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render as an article element', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const article = screen.getByTestId('post-card');
      expect(article.tagName).toBe('ARTICLE');
    });

    it('should have accessible image with alt text', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const image = screen.getByAltText('Amazing Technology Post');
      expect(image).toBeInTheDocument();
    });

    it('should have accessible avatar with alt text', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
    });

    it('should have visible title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByText('Amazing Technology Post')).toBeVisible();
    });

    it('should have visible user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeVisible();
    });
  });

  describe('structure', () => {
    it('should render h3 for title', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const title = screen.getByText('Amazing Technology Post');
      expect(title.tagName).toBe('H3');
    });

    it('should render span for user name', () => {
      render(<ExplorePostCard {...defaultProps} />);
      const userName = screen.getByText('John Doe');
      expect(userName.tagName).toBe('SPAN');
    });
  });
});
