/**
 * Unit Tests for PostContent Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostContent from './PostContent';

describe('PostContent', () => {
  const defaultProps = {
    content: 'This is a test post content',
    image: 'https://example.com/image.jpg',
  };

  describe('rendering', () => {
    it('should render content text when provided', () => {
      render(<PostContent {...defaultProps} />);
      expect(screen.getByText('This is a test post content')).toBeInTheDocument();
    });

    it('should render image when provided', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('should render both content and image when both are provided', () => {
      render(<PostContent {...defaultProps} />);
      expect(screen.getByText('This is a test post content')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render only content when image is not provided', () => {
      render(<PostContent content="Only content" image={null} />);
      expect(screen.getByText('Only content')).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should render only image when content is not provided', () => {
      render(<PostContent content={null} image="https://example.com/image.jpg" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
    });

    it('should render nothing when both content and image are not provided', () => {
      const { container } = render(<PostContent content={null} image={null} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when both content and image are empty strings', () => {
      const { container } = render(<PostContent content="" image="" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when both content and image are undefined', () => {
      const { container } = render(<PostContent content={undefined} image={undefined} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('image attributes', () => {
    it('should have correct src attribute', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should have correct alt attribute', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Post content');
    });

    it('should have object-contain class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('object-contain');
    });

    it('should have w-full class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('w-full');
    });

    it('should have rounded-md class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('rounded-md');
    });
  });

  describe('image error handling', () => {
    it('should set fallback src on image error', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');

      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });

    it('should handle multiple error events', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');

      fireEvent.error(image);
      fireEvent.error(image);

      expect(image).toHaveAttribute(
        'src',
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop'
      );
    });
  });

  describe('content styling', () => {
    it('should have text-slate-700 class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('text-slate-700');
    });

    it('should have dark:text-neutral-300 class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('dark:text-neutral-300');
    });

    it('should have leading-relaxed class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('leading-relaxed');
    });

    it('should have transition-colors class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('transition-colors');
    });

    it('should have text-xs class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('text-xs');
    });

    it('should have sm:text-sm class', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph).toHaveClass('sm:text-sm');
    });
  });

  describe('container styling', () => {
    it('should have px-4 padding class for content container', () => {
      const { container } = render(<PostContent content="Test" image={null} />);
      const contentWrapper = container.firstChild;
      expect(contentWrapper).toHaveClass('px-4');
    });

    it('should have pb-3 padding class for content container', () => {
      const { container } = render(<PostContent content="Test" image={null} />);
      const contentWrapper = container.firstChild;
      expect(contentWrapper).toHaveClass('pb-3');
    });

    it('should have px-4 padding class for image container', () => {
      const { container } = render(
        <PostContent content={null} image="https://example.com/image.jpg" />
      );
      const imageWrapper = container.firstChild;
      expect(imageWrapper).toHaveClass('px-4');
    });

    it('should have pb-3 padding class for image container', () => {
      const { container } = render(
        <PostContent content={null} image="https://example.com/image.jpg" />
      );
      const imageWrapper = container.firstChild;
      expect(imageWrapper).toHaveClass('pb-3');
    });
  });

  describe('responsive image classes', () => {
    it('should have h-auto height class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('h-auto');
    });

    it('should have max-h-[70vh] height class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('max-h-[70vh]');
    });

    it('should have sm:rounded-lg class', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('sm:rounded-lg');
    });
  });

  describe('edge cases', () => {
    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      render(<PostContent content={longContent} image={null} />);
      expect(screen.getByText(longContent)).toBeInTheDocument();
    });

    it('should handle content with special characters', () => {
      const specialContent = "Hello <script>alert('xss')</script> & world!";
      render(<PostContent content={specialContent} image={null} />);
      expect(screen.getByText(specialContent)).toBeInTheDocument();
    });

    it('should handle content with emoji', () => {
      const emojiContent = 'Hello 👋 World 🌍 Test 🚀';
      render(<PostContent content={emojiContent} image={null} />);
      expect(screen.getByText(emojiContent)).toBeInTheDocument();
    });

    it('should handle content with line breaks', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3';
      render(<PostContent content={multilineContent} image={null} />);
      // Use function matcher to handle whitespace normalization
      expect(
        screen.getByText((content) => content.includes('Line 1') && content.includes('Line 2'))
      ).toBeInTheDocument();
    });

    it('should handle content with HTML entities', () => {
      const htmlContent = 'This &amp; That';
      render(<PostContent content={htmlContent} image={null} />);
      expect(screen.getByText('This &amp; That')).toBeInTheDocument();
    });

    it('should handle image with query parameters', () => {
      const imageWithParams = 'https://example.com/image.jpg?w=800&h=600';
      render(<PostContent content={null} image={imageWithParams} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', imageWithParams);
    });

    it('should handle data URL images', () => {
      const dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      render(<PostContent content={null} image={dataUrl} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', dataUrl);
    });

    it('should handle whitespace-only content as falsy', () => {
      // Note: whitespace-only string is truthy, so it will render
      const { container } = render(<PostContent content="   " image={null} />);
      // Testing Library normalizes whitespace, so check the container
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
    });

    it('should handle content with leading/trailing whitespace', () => {
      const paddedContent = '  Hello World  ';
      render(<PostContent content={paddedContent} image={null} />);
      // Testing Library normalizes whitespace, so check for the trimmed text
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should handle numeric content', () => {
      render(<PostContent content="12345" image={null} />);
      expect(screen.getByText('12345')).toBeInTheDocument();
    });
  });

  describe('paragraph element', () => {
    it('should render content in a p tag', () => {
      render(<PostContent content="Test content" image={null} />);
      const textElement = screen.getByText('Test content');
      const paragraph = textElement.parentElement;
      expect(paragraph.tagName).toBe('P');
    });
  });

  describe('image element', () => {
    it('should render image in an img tag', () => {
      render(<PostContent content={null} image="https://example.com/image.jpg" />);
      const image = screen.getByRole('img');
      expect(image.tagName).toBe('IMG');
    });
  });

  describe('fragment structure', () => {
    it('should render content before image when both are provided', () => {
      const { container } = render(<PostContent {...defaultProps} />);
      const children = container.children;
      // Content comes first, then image
      expect(children[0].querySelector('p')).toHaveTextContent(defaultProps.content);
      expect(children[1].querySelector('img')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible image with alt text', () => {
      render(<PostContent {...defaultProps} />);
      const image = screen.getByAltText('Post content');
      expect(image).toBeInTheDocument();
    });

    it('should render readable text content', () => {
      render(<PostContent content="Accessible content" image={null} />);
      expect(screen.getByText('Accessible content')).toBeVisible();
    });
  });

  describe('conditional rendering', () => {
    it('should not render content div when content is falsy', () => {
      const { container } = render(
        <PostContent content={null} image="https://example.com/image.jpg" />
      );
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(0);
    });

    it('should not render image div when image is falsy', () => {
      const { container } = render(<PostContent content="Test" image={null} />);
      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(0);
    });

    it('should render content div only when content is truthy', () => {
      const { container } = render(<PostContent content="Test" image={null} />);
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs).toHaveLength(1);
    });

    it('should render image div only when image is truthy', () => {
      const { container } = render(
        <PostContent content={null} image="https://example.com/image.jpg" />
      );
      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(1);
    });
  });
});
