/**
 * Unit Tests for PostComments Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostComments from './PostComments';

// Mock scrollTo on Element prototype
Element.prototype.scrollTo = vi.fn();

// Mock Avatar component
vi.mock('../../common/Avatar', () => ({
  default: ({ src, alt, size, className }) => (
    <img src={src} alt={alt} data-testid="avatar" data-size={size} className={className} />
  ),
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
    button: ({ children, className, onClick, disabled, ...props }) => (
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        data-testid="motion-button"
        {...props}
      >
        {children}
      </button>
    ),
  },
}));

describe('PostComments', () => {
  const mockComments = [
    {
      id: 'c1',
      postId: 'post-1',
      user: {
        name: 'John Doe',
        avatar: 'https://example.com/john.jpg',
      },
      content: 'Great post!',
      timestamp: '2 hours ago',
    },
    {
      id: 'c2',
      postId: 'post-1',
      user: {
        name: 'Jane Smith',
        avatar: 'https://example.com/jane.jpg',
      },
      content: 'I agree with this.',
      timestamp: '1 hour ago',
    },
    {
      id: 'c3',
      postId: 'post-2',
      user: {
        name: 'Bob Wilson',
        avatar: 'https://example.com/bob.jpg',
      },
      content: 'Different post comment',
      timestamp: '30 minutes ago',
    },
  ];

  const mockCurrentUser = {
    id: 'user-1',
    name: 'Current User',
  };

  const defaultProps = {
    postId: 'post-1',
    comments: mockComments,
    currentUser: mockCurrentUser,
    currentUserAvatar: 'https://example.com/current-user.jpg',
    newComment: {},
    setNewComment: vi.fn(),
    onAddComment: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    });

    it('should render comments for the specific postId', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByText('Great post!')).toBeInTheDocument();
      expect(screen.getByText('I agree with this.')).toBeInTheDocument();
    });

    it('should not render comments from other posts', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.queryByText('Different post comment')).not.toBeInTheDocument();
    });

    it('should render the post button', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
    });

    it('should render comment input field', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toBeInTheDocument();
    });

    it('should render current user avatar', () => {
      render(<PostComments {...defaultProps} />);
      const avatars = screen.getAllByTestId('avatar');
      const currentUserAvatar = avatars.find((a) => a.getAttribute('alt') === 'Current User');
      expect(currentUserAvatar).toBeInTheDocument();
    });
  });

  describe('filtering comments by postId', () => {
    it('should filter comments by postId', () => {
      render(<PostComments {...defaultProps} postId="post-2" />);
      expect(screen.queryByText('Great post!')).not.toBeInTheDocument();
      expect(screen.queryByText('I agree with this.')).not.toBeInTheDocument();
      expect(screen.getByText('Different post comment')).toBeInTheDocument();
    });

    it('should render empty list when no comments match postId', () => {
      render(<PostComments {...defaultProps} postId="non-existent" />);
      expect(screen.queryByText('Great post!')).not.toBeInTheDocument();
      expect(screen.queryByText('I agree with this.')).not.toBeInTheDocument();
      expect(screen.queryByText('Different post comment')).not.toBeInTheDocument();
    });
  });

  describe('comment input', () => {
    it('should display empty value when newComment is empty', () => {
      render(<PostComments {...defaultProps} newComment={{}} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveValue('');
    });

    it('should display value from newComment for the postId', () => {
      render(<PostComments {...defaultProps} newComment={{ 'post-1': 'My comment' }} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveValue('My comment');
    });

    it('should call setNewComment when input changes', () => {
      const setNewComment = vi.fn();
      render(<PostComments {...defaultProps} setNewComment={setNewComment} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      fireEvent.change(input, { target: { value: 'New comment text' } });
      expect(setNewComment).toHaveBeenCalledTimes(1);
    });

    it('should update newComment with correct postId', () => {
      const setNewComment = vi.fn();
      render(<PostComments {...defaultProps} setNewComment={setNewComment} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      fireEvent.change(input, { target: { value: 'Test' } });

      // Verify setNewComment was called with a function
      expect(setNewComment).toHaveBeenCalledWith(expect.any(Function));

      // Verify the function spreads prev and adds the postId key
      const updateFn = setNewComment.mock.calls[0][0];
      const result = updateFn({ existingKey: 'value' });
      expect(result).toHaveProperty('post-1');
      expect(result).toHaveProperty('existingKey', 'value');
    });
  });

  describe('submit button', () => {
    it('should be disabled when newComment is empty', () => {
      render(<PostComments {...defaultProps} newComment={{}} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).toBeDisabled();
    });

    it('should be disabled when newComment is only whitespace', () => {
      render(<PostComments {...defaultProps} newComment={{ 'post-1': '   ' }} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).toBeDisabled();
    });

    it('should be enabled when newComment has content', () => {
      render(<PostComments {...defaultProps} newComment={{ 'post-1': 'Valid comment' }} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).not.toBeDisabled();
    });

    it('should call onAddComment with postId when clicked', () => {
      const onAddComment = vi.fn();
      render(
        <PostComments
          {...defaultProps}
          newComment={{ 'post-1': 'Valid comment' }}
          onAddComment={onAddComment}
        />
      );
      const button = screen.getByRole('button', { name: 'Post' });
      fireEvent.click(button);
      expect(onAddComment).toHaveBeenCalledWith('post-1');
    });
  });

  describe('keyboard interaction', () => {
    it('should call onAddComment when Enter is pressed', () => {
      const onAddComment = vi.fn();
      render(
        <PostComments
          {...defaultProps}
          newComment={{ 'post-1': 'Valid comment' }}
          onAddComment={onAddComment}
        />
      );
      const input = screen.getByPlaceholderText('Write a comment...');
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });
      expect(onAddComment).toHaveBeenCalledWith('post-1');
    });

    it('should not call onAddComment when Shift+Enter is pressed', () => {
      const onAddComment = vi.fn();
      render(
        <PostComments
          {...defaultProps}
          newComment={{ 'post-1': 'Valid comment' }}
          onAddComment={onAddComment}
        />
      );
      const input = screen.getByPlaceholderText('Write a comment...');
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
      expect(onAddComment).not.toHaveBeenCalled();
    });

    it('should not call onAddComment for other keys', () => {
      const onAddComment = vi.fn();
      render(
        <PostComments
          {...defaultProps}
          newComment={{ 'post-1': 'Valid comment' }}
          onAddComment={onAddComment}
        />
      );
      const input = screen.getByPlaceholderText('Write a comment...');
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(onAddComment).not.toHaveBeenCalled();
    });
  });

  describe('comment item rendering', () => {
    it('should render comment user name', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render comment content', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByText('Great post!')).toBeInTheDocument();
      expect(screen.getByText('I agree with this.')).toBeInTheDocument();
    });

    it('should render comment timestamp', () => {
      render(<PostComments {...defaultProps} />);
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
      expect(screen.getByText('1 hour ago')).toBeInTheDocument();
    });

    it('should render comment user avatars', () => {
      render(<PostComments {...defaultProps} />);
      const avatars = screen.getAllByTestId('avatar');
      const johnAvatar = avatars.find((a) => a.getAttribute('alt') === 'John Doe');
      const janeAvatar = avatars.find((a) => a.getAttribute('alt') === 'Jane Smith');
      expect(johnAvatar).toBeInTheDocument();
      expect(janeAvatar).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have bg-slate-50 class on container', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      expect(container.firstChild).toHaveClass('bg-slate-50');
    });

    it('should have transition-colors class on container', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      expect(container.firstChild).toHaveClass('transition-colors');
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      expect(container.firstChild).toHaveClass('p-2');
      expect(container.firstChild).toHaveClass('sm:p-4');
    });

    it('should have border-t on input section', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      const inputSection = container.querySelector('.border-t');
      expect(inputSection).toBeInTheDocument();
    });
  });

  describe('button styling', () => {
    it('should have bg-orange-500 class', () => {
      render(<PostComments {...defaultProps} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).toHaveClass('bg-orange-500');
    });

    it('should have disabled opacity class when disabled', () => {
      render(<PostComments {...defaultProps} newComment={{}} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).toHaveClass('disabled:opacity-40');
    });

    it('should have rounded-full class', () => {
      render(<PostComments {...defaultProps} />);
      const button = screen.getByRole('button', { name: 'Post' });
      expect(button).toHaveClass('rounded-full');
    });
  });

  describe('input styling', () => {
    it('should have rounded-full class', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveClass('rounded-full');
    });

    it('should have focus ring classes', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('focus:ring-orange-500');
    });

    it('should have transition-colors class', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveClass('transition-colors');
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode class on container', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      expect(container.firstChild).toHaveClass('dark:bg-neutral-800/50');
    });

    it('should have dark mode class on input', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveClass('dark:bg-neutral-700');
    });
  });

  describe('comments container', () => {
    it('should have max-height classes for scrolling', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      const commentsContainer = container.querySelector('.max-h-60');
      expect(commentsContainer).toBeInTheDocument();
    });

    it('should have overflow-y-auto for scrolling', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      const commentsContainer = container.querySelector('.overflow-y-auto');
      expect(commentsContainer).toBeInTheDocument();
    });

    it('should have custom-scrollbar class', () => {
      const { container } = render(<PostComments {...defaultProps} />);
      const commentsContainer = container.querySelector('.custom-scrollbar');
      expect(commentsContainer).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty comments array', () => {
      render(<PostComments {...defaultProps} comments={[]} />);
      expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
      expect(screen.queryByText('Great post!')).not.toBeInTheDocument();
    });

    it('should handle long comment content', () => {
      const longComment = {
        id: 'long',
        postId: 'post-1',
        user: { name: 'User', avatar: 'https://example.com/user.jpg' },
        content:
          'This is a very long comment that should still render correctly without breaking the layout or causing any issues with the display.',
        timestamp: 'Just now',
      };
      render(<PostComments {...defaultProps} comments={[...mockComments, longComment]} />);
      expect(screen.getByText(longComment.content)).toBeInTheDocument();
    });

    it('should handle special characters in comment', () => {
      const specialComment = {
        id: 'special',
        postId: 'post-1',
        user: { name: 'User', avatar: 'https://example.com/user.jpg' },
        content: 'Comment with <special> & characters!',
        timestamp: 'Just now',
      };
      render(<PostComments {...defaultProps} comments={[...mockComments, specialComment]} />);
      expect(screen.getByText('Comment with <special> & characters!')).toBeInTheDocument();
    });

    it('should handle emoji in comment', () => {
      const emojiComment = {
        id: 'emoji',
        postId: 'post-1',
        user: { name: 'User', avatar: 'https://example.com/user.jpg' },
        content: 'Great post! 🎉🚀',
        timestamp: 'Just now',
      };
      render(<PostComments {...defaultProps} comments={[emojiComment]} />);
      expect(screen.getByText('Great post! 🎉🚀')).toBeInTheDocument();
    });
  });

  describe('avatar props', () => {
    it('should pass sm size to comment avatars', () => {
      render(<PostComments {...defaultProps} />);
      const avatars = screen.getAllByTestId('avatar');
      avatars.forEach((avatar) => {
        expect(avatar).toHaveAttribute('data-size', 'sm');
      });
    });

    it('should pass correct src to current user avatar', () => {
      render(<PostComments {...defaultProps} />);
      const avatars = screen.getAllByTestId('avatar');
      const currentUserAvatar = avatars.find((a) => a.getAttribute('alt') === 'Current User');
      expect(currentUserAvatar).toHaveAttribute('src', 'https://example.com/current-user.jpg');
    });

    it('should pass correct alt to current user avatar', () => {
      render(<PostComments {...defaultProps} />);
      const avatars = screen.getAllByTestId('avatar');
      const currentUserAvatar = avatars.find((a) => a.getAttribute('alt') === 'Current User');
      expect(currentUserAvatar).toBeInTheDocument();
    });
  });

  describe('input type', () => {
    it('should have type text', () => {
      render(<PostComments {...defaultProps} />);
      const input = screen.getByPlaceholderText('Write a comment...');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
});
