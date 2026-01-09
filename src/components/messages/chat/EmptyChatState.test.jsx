/**
 * Unit Tests for EmptyChatState Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyChatState from './EmptyChatState';

describe('EmptyChatState', () => {
  describe('rendering', () => {
    it('should render the component', () => {
      render(<EmptyChatState />);
      expect(screen.getByText('Select a chat')).toBeInTheDocument();
    });

    it('should render the title', () => {
      render(<EmptyChatState />);
      expect(screen.getByText('Select a chat')).toBeInTheDocument();
    });

    it('should render the description', () => {
      render(<EmptyChatState />);
      expect(screen.getByText('Choose a conversation to start messaging')).toBeInTheDocument();
    });

    it('should render the chat icon', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('structure', () => {
    it('should render h3 tag for title', () => {
      render(<EmptyChatState />);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Select a chat');
    });

    it('should render p tag for description', () => {
      render(<EmptyChatState />);
      const description = screen.getByText('Choose a conversation to start messaging');
      expect(description.tagName).toBe('P');
    });

    it('should have icon container', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.rounded-full');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have flex-1 class on container', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('flex-1');
    });

    it('should have flex and center alignment classes', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('flex');
      expect(mainContainer).toHaveClass('items-center');
      expect(mainContainer).toHaveClass('justify-center');
    });

    it('should have background color classes', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('bg-slate-50');
    });

    it('should have padding class', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('p-4');
    });

    it('should have transition-colors class on container', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('transition-colors');
    });

    it('should have text-center class on content wrapper', () => {
      const { container } = render(<EmptyChatState />);
      const textCenter = container.querySelector('.text-center');
      expect(textCenter).toBeInTheDocument();
    });
  });

  describe('icon styling', () => {
    it('should have icon with correct size classes', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-6');
      expect(svg).toHaveClass('h-6');
    });

    it('should have icon with responsive size classes', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('sm:w-8');
      expect(svg).toHaveClass('sm:h-8');
    });

    it('should have icon with color classes', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-slate-400');
    });

    it('should have icon container with background', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.bg-slate-100');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should have icon container centered horizontally', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.mx-auto');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('title styling', () => {
    it('should have font-semibold class', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('font-semibold');
    });

    it('should have text color classes', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('text-slate-700');
    });

    it('should have responsive text size classes', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('text-base');
      expect(title).toHaveClass('sm:text-lg');
    });

    it('should have margin bottom class', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('mb-1');
    });

    it('should have transition-colors class', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('transition-colors');
    });
  });

  describe('description styling', () => {
    it('should have text color classes', () => {
      render(<EmptyChatState />);
      const description = screen.getByText('Choose a conversation to start messaging');
      expect(description).toHaveClass('text-slate-500');
    });

    it('should have responsive text size classes', () => {
      render(<EmptyChatState />);
      const description = screen.getByText('Choose a conversation to start messaging');
      expect(description).toHaveClass('text-xs');
      expect(description).toHaveClass('sm:text-sm');
    });

    it('should have transition-colors class', () => {
      render(<EmptyChatState />);
      const description = screen.getByText('Choose a conversation to start messaging');
      expect(description).toHaveClass('transition-colors');
    });
  });

  describe('dark mode classes', () => {
    it('should have dark mode class on container', () => {
      const { container } = render(<EmptyChatState />);
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('dark:bg-neutral-800/50');
    });

    it('should have dark mode class on icon container', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.dark\\:bg-slate-700');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should have dark mode class on icon', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('dark:text-neutral-500');
    });

    it('should have dark mode class on title', () => {
      render(<EmptyChatState />);
      const title = screen.getByText('Select a chat');
      expect(title).toHaveClass('dark:text-neutral-200');
    });

    it('should have dark mode class on description', () => {
      render(<EmptyChatState />);
      const description = screen.getByText('Choose a conversation to start messaging');
      expect(description).toHaveClass('dark:text-neutral-400');
    });
  });

  describe('SVG icon attributes', () => {
    it('should have fill none', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });

    it('should have stroke currentColor', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('should have viewBox attribute', () => {
      const { container } = render(<EmptyChatState />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should have path element', () => {
      const { container } = render(<EmptyChatState />);
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('should have strokeLinecap round', () => {
      const { container } = render(<EmptyChatState />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('stroke-linecap', 'round');
    });

    it('should have strokeLinejoin round', () => {
      const { container } = render(<EmptyChatState />);
      const path = container.querySelector('path');
      expect(path).toHaveAttribute('stroke-linejoin', 'round');
    });
  });

  describe('responsive design', () => {
    it('should have responsive icon container size', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.w-14');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('h-14');
      expect(iconContainer).toHaveClass('sm:w-16');
      expect(iconContainer).toHaveClass('sm:h-16');
    });

    it('should have responsive margin on icon container', () => {
      const { container } = render(<EmptyChatState />);
      const iconContainer = container.querySelector('.mb-3');
      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass('sm:mb-4');
    });
  });

  describe('accessibility', () => {
    it('should have heading for screen readers', () => {
      render(<EmptyChatState />);
      expect(screen.getByRole('heading', { name: 'Select a chat' })).toBeInTheDocument();
    });

    it('should have descriptive text', () => {
      render(<EmptyChatState />);
      expect(screen.getByText('Choose a conversation to start messaging')).toBeInTheDocument();
    });
  });
});
