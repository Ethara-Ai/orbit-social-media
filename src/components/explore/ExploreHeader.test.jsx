/**
 * Unit Tests for ExploreHeader Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExploreHeader from './ExploreHeader';

describe('ExploreHeader', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<ExploreHeader />);
      expect(container).toBeInTheDocument();
    });

    it('should render the "Discover" title', () => {
      render(<ExploreHeader />);
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    it('should render the subtitle', () => {
      render(<ExploreHeader />);
      expect(screen.getByText('Explore content from creators worldwide')).toBeInTheDocument();
    });

    it('should render title as h1 element', () => {
      render(<ExploreHeader />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Discover');
    });

    it('should render subtitle as p element', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle.tagName).toBe('P');
    });
  });

  describe('title styling', () => {
    it('should have text-2xl class on title', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass('text-2xl');
    });

    it('should have font-bold class on title', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass('font-bold');
    });

    it('should have text-slate-900 class on title', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass('text-slate-900');
    });

    it('should have transition-colors class on title', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass('transition-colors');
    });
  });

  describe('subtitle styling', () => {
    it('should have text-slate-500 class on subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass('text-slate-500');
    });

    it('should have text-sm class on subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass('text-sm');
    });

    it('should have mt-1 class on subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass('mt-1');
    });

    it('should have transition-colors class on subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass('transition-colors');
    });
  });

  describe('container styling', () => {
    it('should have mb-8 class on container', () => {
      const { container } = render(<ExploreHeader />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('mb-8');
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode class on title', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass('dark:text-white');
    });

    it('should have dark mode class on subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass('dark:text-slate-400');
    });
  });

  describe('semantic HTML', () => {
    it('should have proper heading hierarchy', () => {
      render(<ExploreHeader />);
      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent('Discover');
    });

    it('should have descriptive subtitle text', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should be accessible with proper heading', () => {
      render(<ExploreHeader />);
      const heading = screen.getByRole('heading', { name: 'Discover' });
      expect(heading).toBeInTheDocument();
    });

    it('should have readable text content', () => {
      render(<ExploreHeader />);
      expect(screen.getByText('Discover')).toBeInTheDocument();
      expect(screen.getByText('Explore content from creators worldwide')).toBeInTheDocument();
    });
  });

  describe('snapshot', () => {
    it('should match snapshot', () => {
      const { container } = render(<ExploreHeader />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('structure', () => {
    it('should have title before subtitle', () => {
      const { container } = render(<ExploreHeader />);
      const children = container.firstChild.children;
      expect(children[0].tagName).toBe('H1');
      expect(children[1].tagName).toBe('P');
    });

    it('should contain exactly two child elements', () => {
      const { container } = render(<ExploreHeader />);
      const children = container.firstChild.children;
      expect(children).toHaveLength(2);
    });
  });

  describe('text content', () => {
    it('should not have empty title', () => {
      render(<ExploreHeader />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title.textContent.trim()).not.toBe('');
    });

    it('should not have empty subtitle', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle.textContent.trim()).not.toBe('');
    });

    it('should have specific title text', () => {
      render(<ExploreHeader />);
      const title = screen.getByRole('heading', { level: 1 });
      expect(title.textContent).toBe('Discover');
    });

    it('should have specific subtitle text', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText(/Explore content/);
      expect(subtitle.textContent).toBe('Explore content from creators worldwide');
    });
  });

  describe('motion wrapper', () => {
    it('should render as a div element', () => {
      const { container } = render(<ExploreHeader />);
      expect(container.firstChild.tagName).toBe('DIV');
    });

    it('should be present in the DOM', () => {
      const { container } = render(<ExploreHeader />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('combined styling', () => {
    it('should have all required title classes', () => {
      render(<ExploreHeader />);
      const title = screen.getByText('Discover');
      expect(title).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-slate-900',
        'dark:text-white',
        'transition-colors'
      );
    });

    it('should have all required subtitle classes', () => {
      render(<ExploreHeader />);
      const subtitle = screen.getByText('Explore content from creators worldwide');
      expect(subtitle).toHaveClass(
        'text-slate-500',
        'dark:text-slate-400',
        'text-sm',
        'mt-1',
        'transition-colors'
      );
    });
  });
});
