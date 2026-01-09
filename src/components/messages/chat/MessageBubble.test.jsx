/**
 * Unit Tests for MessageBubble Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageBubble from './MessageBubble';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }) => (
      <div className={className} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

describe('MessageBubble', () => {
  const sentMessage = {
    id: 'msg-1',
    text: 'Hello, how are you?',
    timestamp: '10:30 AM',
    isSent: true,
    attachment: null,
  };

  const receivedMessage = {
    id: 'msg-2',
    text: "I'm doing great, thanks!",
    timestamp: '10:31 AM',
    isSent: false,
    attachment: null,
  };

  const messageWithAttachment = {
    id: 'msg-3',
    text: 'Check out this photo!',
    timestamp: '10:32 AM',
    isSent: true,
    attachment: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the component', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    it('should render message text', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    it('should render timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    });

    it('should render sent message correctly', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    it('should render received message correctly', () => {
      render(<MessageBubble message={receivedMessage} />);
      expect(screen.getByText("I'm doing great, thanks!")).toBeInTheDocument();
    });

    it('should render attachment when provided', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('should not render attachment when not provided', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render both attachment and text when both are provided', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      expect(screen.getByText('Check out this photo!')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });

  describe('sent message styling', () => {
    it('should have justify-end class for sent messages', () => {
      render(<MessageBubble message={sentMessage} />);
      const container = screen.getByTestId('motion-div');
      expect(container).toHaveClass('justify-end');
    });

    it('should have bg-orange-500 class for sent messages', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.bg-orange-500');
      expect(bubble).toBeInTheDocument();
    });

    it('should have text-white class for sent messages', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.text-white');
      expect(bubble).toBeInTheDocument();
    });

    it('should have rounded-br-md class for sent messages', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.rounded-br-md');
      expect(bubble).toBeInTheDocument();
    });
  });

  describe('received message styling', () => {
    it('should have justify-start class for received messages', () => {
      render(<MessageBubble message={receivedMessage} />);
      const container = screen.getByTestId('motion-div');
      expect(container).toHaveClass('justify-start');
    });

    it('should have bg-white class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.bg-white');
      expect(bubble).toBeInTheDocument();
    });

    it('should have text-slate-800 class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.text-slate-800');
      expect(bubble).toBeInTheDocument();
    });

    it('should have rounded-bl-md class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.rounded-bl-md');
      expect(bubble).toBeInTheDocument();
    });

    it('should have shadow-xs class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.shadow-xs');
      expect(bubble).toBeInTheDocument();
    });
  });

  describe('timestamp styling', () => {
    it('should have text-orange-100 class for sent message timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      const timestamp = screen.getByText('10:30 AM');
      expect(timestamp).toHaveClass('text-orange-100');
    });

    it('should have text-slate-400 class for received message timestamp', () => {
      render(<MessageBubble message={receivedMessage} />);
      const timestamp = screen.getByText('10:31 AM');
      expect(timestamp).toHaveClass('text-slate-400');
    });

    it('should have text-[10px] class for timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      const timestamp = screen.getByText('10:30 AM');
      expect(timestamp.className).toMatch(/text-\[10px\]/);
    });

    it('should have text-right class for timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      const timestamp = screen.getByText('10:30 AM');
      expect(timestamp).toHaveClass('text-right');
    });

    it('should have mt-1 class for timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      const timestamp = screen.getByText('10:30 AM');
      expect(timestamp).toHaveClass('mt-1');
    });

    it('should have transition-colors class for timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      const timestamp = screen.getByText('10:30 AM');
      expect(timestamp).toHaveClass('transition-colors');
    });
  });

  describe('attachment', () => {
    it('should have correct src attribute', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should have correct alt attribute', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Attachment');
    });

    it('should have max-w-xs class', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('max-w-xs');
    });

    it('should have h-auto class', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('h-auto');
    });

    it('should have rounded-xl class', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('rounded-xl');
    });

    it('should have object-cover class', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('object-cover');
    });

    it('should have w-full class for full width within bubble', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('w-full');
    });

    it('should have mb-1 class on attachment container when text is present', () => {
      const { container } = render(<MessageBubble message={messageWithAttachment} />);
      const attachmentContainer = container.querySelector('.mb-1');
      expect(attachmentContainer).toBeInTheDocument();
    });

    it('should not have margin on attachment container when no text', () => {
      const attachmentOnly = {
        ...messageWithAttachment,
        text: '',
      };
      const { container } = render(<MessageBubble message={attachmentOnly} />);
      const attachmentContainer = container.querySelector('.mb-1');
      expect(attachmentContainer).not.toBeInTheDocument();
    });
  });

  describe('attachment error handling', () => {
    it('should set fallback src on image error', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');

      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });

    it('should handle multiple error events', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByRole('img');

      fireEvent.error(image);
      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });
  });

  describe('bubble styling', () => {
    it('should have rounded-2xl class', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.rounded-2xl');
      expect(bubble).toBeInTheDocument();
    });

    it('should have px-4 class', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.px-4');
      expect(bubble).toBeInTheDocument();
    });

    it('should have py-2.5 class', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.py-2\\.5');
      expect(bubble).toBeInTheDocument();
    });

    it('should have transition-colors class', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.transition-colors');
      expect(bubble).toBeInTheDocument();
    });

    it('should have max-w-[75%] class', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.max-w-\\[75\\%\\]');
      expect(bubble).toBeInTheDocument();
    });
  });

  describe('text styling', () => {
    it('should have text-sm class for message text', () => {
      render(<MessageBubble message={sentMessage} />);
      const textElement = screen.getByText('Hello, how are you?');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('text-sm');
    });

    it('should render text in p tag', () => {
      render(<MessageBubble message={sentMessage} />);
      const textElement = screen.getByText('Hello, how are you?');
      const paragraph = textElement.parentElement;
      expect(paragraph.tagName).toBe('P');
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode background class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.dark\\:bg-neutral-700');
      expect(bubble).toBeInTheDocument();
    });

    it('should have dark mode text class for received messages', () => {
      const { container } = render(<MessageBubble message={receivedMessage} />);
      const bubble = container.querySelector('.dark\\:text-slate-100');
      expect(bubble).toBeInTheDocument();
    });

    it('should have dark mode timestamp class for received messages', () => {
      render(<MessageBubble message={receivedMessage} />);
      const timestamp = screen.getByText('10:31 AM');
      expect(timestamp).toHaveClass('dark:text-neutral-500');
    });

    it('should have rounded-xl class for received attachment', () => {
      const receivedWithAttachment = {
        ...messageWithAttachment,
        isSent: false,
      };
      render(<MessageBubble message={receivedWithAttachment} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('rounded-xl');
    });
  });

  describe('edge cases', () => {
    it('should handle empty text', () => {
      const emptyTextMessage = { ...sentMessage, text: '' };
      const { container } = render(<MessageBubble message={emptyTextMessage} />);
      // Should render without text but with timestamp
      expect(screen.getByText('10:30 AM')).toBeInTheDocument();
      // Check that there's no text-sm paragraph (the message text paragraph)
      expect(container.querySelector('p.text-sm')).toBeNull();
    });

    it('should handle null text', () => {
      const nullTextMessage = { ...sentMessage, text: null };
      const { container } = render(<MessageBubble message={nullTextMessage} />);
      expect(screen.getByText('10:30 AM')).toBeInTheDocument();
      // Check that there's no text-sm paragraph (the message text paragraph)
      expect(container.querySelector('p.text-sm')).toBeNull();
    });

    it('should handle long text', () => {
      const longText = 'A'.repeat(500);
      const longMessage = { ...sentMessage, text: longText };
      render(<MessageBubble message={longMessage} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle text with special characters', () => {
      const specialMessage = {
        ...sentMessage,
        text: "Hello <script>alert('xss')</script> & goodbye!",
      };
      render(<MessageBubble message={specialMessage} />);
      expect(
        screen.getByText("Hello <script>alert('xss')</script> & goodbye!")
      ).toBeInTheDocument();
    });

    it('should handle text with emoji', () => {
      const emojiMessage = { ...sentMessage, text: 'Hello 👋 World 🌍' };
      render(<MessageBubble message={emojiMessage} />);
      expect(screen.getByText('Hello 👋 World 🌍')).toBeInTheDocument();
    });

    it('should handle text with line breaks', () => {
      const multilineMessage = { ...sentMessage, text: 'Line 1\nLine 2' };
      render(<MessageBubble message={multilineMessage} />);
      // Use a function matcher to handle the whitespace normalization
      expect(
        screen.getByText((content) => content.includes('Line 1') && content.includes('Line 2'))
      ).toBeInTheDocument();
    });

    it('should handle attachment-only message', () => {
      const attachmentOnlyMessage = {
        ...messageWithAttachment,
        text: null,
      };
      render(<MessageBubble message={attachmentOnlyMessage} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('10:32 AM')).toBeInTheDocument();
    });

    it('should handle different timestamp formats', () => {
      const differentTimestamp = { ...sentMessage, timestamp: '2:45 PM' };
      render(<MessageBubble message={differentTimestamp} />);
      expect(screen.getByText('2:45 PM')).toBeInTheDocument();
    });

    it('should handle 24-hour timestamp format', () => {
      const militaryTime = { ...sentMessage, timestamp: '14:30' };
      render(<MessageBubble message={militaryTime} />);
      expect(screen.getByText('14:30')).toBeInTheDocument();
    });

    it('should handle data URL images', () => {
      const dataUrlMessage = {
        ...messageWithAttachment,
        attachment:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };
      render(<MessageBubble message={dataUrlMessage} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', dataUrlMessage.attachment);
    });
  });

  describe('layout', () => {
    it('should render as flex container', () => {
      render(<MessageBubble message={sentMessage} />);
      const container = screen.getByTestId('motion-div');
      expect(container).toHaveClass('flex');
    });

    it('should have correct alignment for sent messages', () => {
      render(<MessageBubble message={sentMessage} />);
      const container = screen.getByTestId('motion-div');
      expect(container).toHaveClass('justify-end');
    });

    it('should have correct alignment for received messages', () => {
      render(<MessageBubble message={receivedMessage} />);
      const container = screen.getByTestId('motion-div');
      expect(container).toHaveClass('justify-start');
    });
  });

  describe('structure', () => {
    it('should render attachment before text when both are present', () => {
      const { container } = render(<MessageBubble message={messageWithAttachment} />);
      const bubble = container.querySelector('.max-w-\\[75\\%\\]');
      const children = bubble?.children;

      // First child should be attachment container, then text, then timestamp
      if (children && children.length >= 2) {
        expect(children[0].querySelector('img')).toBeInTheDocument();
      }
    });

    it('should render timestamp as last element in bubble', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const bubble = container.querySelector('.max-w-\\[75\\%\\]');
      const lastChild = bubble?.lastElementChild;

      expect(lastChild).toHaveTextContent('10:30 AM');
    });
  });

  describe('accessibility', () => {
    it('should have accessible image with alt text', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      const image = screen.getByAltText('Attachment');
      expect(image).toBeInTheDocument();
    });

    it('should have readable text content', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('Hello, how are you?')).toBeVisible();
    });

    it('should have readable timestamp', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('10:30 AM')).toBeVisible();
    });
  });

  describe('conditional rendering', () => {
    it('should not render text p element when text is falsy', () => {
      const noTextMessage = { ...sentMessage, text: '' };
      const { container } = render(<MessageBubble message={noTextMessage} />);
      const paragraphs = container.querySelectorAll('p.text-sm');
      expect(paragraphs).toHaveLength(0);
    });

    it('should not render attachment div when attachment is falsy', () => {
      const { container } = render(<MessageBubble message={sentMessage} />);
      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(0);
    });

    it('should render text when text is truthy', () => {
      render(<MessageBubble message={sentMessage} />);
      expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    });

    it('should render attachment when attachment is truthy', () => {
      render(<MessageBubble message={messageWithAttachment} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
  });
});
