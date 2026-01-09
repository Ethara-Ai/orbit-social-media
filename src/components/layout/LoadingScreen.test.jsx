/**
 * Unit Tests for LoadingScreen Component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

describe('LoadingScreen', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<LoadingScreen />);
      expect(container).toBeInTheDocument();
    });

    it('should render the logo with "O" letter', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('O')).toBeInTheDocument();
    });

    it('should render the "Orbit" title', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Orbit')).toBeInTheDocument();
    });

    it('should render the tagline', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Connect • Discover • Thrive')).toBeInTheDocument();
    });

    it('should render the loading message', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Launching your orbit...')).toBeInTheDocument();
    });
  });

  describe('logo styling', () => {
    it('should have gradient background on logo container', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.bg-linear-to-br');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have orange gradient colors', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.from-orange-500');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have amber gradient colors', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.to-amber-500');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have rounded-sm corners on logo', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.rounded-2xl');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have shadow-sm on logo', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.shadow-2xl');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should display "O" in white text', () => {
      render(<LoadingScreen />);
      const logo = screen.getByText('O');
      expect(logo).toHaveClass('text-white');
    });

    it('should have bold font on logo text', () => {
      render(<LoadingScreen />);
      const logo = screen.getByText('O');
      expect(logo).toHaveClass('font-bold');
    });
  });

  describe('title styling', () => {
    it('should have large font size', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('text-4xl');
    });

    it('should have bold font weight', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('font-bold');
    });

    it('should have dark text color', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('text-slate-900');
    });

    it('should have bottom margin', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('mb-2');
    });
  });

  describe('tagline styling', () => {
    it('should have muted text color', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Connect • Discover • Thrive');
      expect(tagline).toHaveClass('text-slate-500');
    });

    it('should have large text size', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Connect • Discover • Thrive');
      expect(tagline).toHaveClass('text-lg');
    });

    it('should have medium font weight', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Connect • Discover • Thrive');
      expect(tagline).toHaveClass('font-medium');
    });
  });

  describe('loading indicator', () => {
    it('should render three loading dots', () => {
      const { container } = render(<LoadingScreen />);
      const loadingDots = container.querySelectorAll('.bg-orange-500.rounded-full.w-3.h-3');
      expect(loadingDots.length).toBe(3);
    });

    it('should have loading dots in a flex container', () => {
      const { container } = render(<LoadingScreen />);
      const dotsContainer = container.querySelector('.flex.justify-center.gap-2');
      expect(dotsContainer).toBeInTheDocument();
    });

    it('should have bottom margin on dots container', () => {
      const { container } = render(<LoadingScreen />);
      const dotsContainer = container.querySelector('.flex.justify-center.gap-2.mb-4');
      expect(dotsContainer).toBeInTheDocument();
    });
  });

  describe('loading message styling', () => {
    it('should have muted text color', () => {
      render(<LoadingScreen />);
      const message = screen.getByText('Launching your orbit...');
      expect(message).toHaveClass('text-slate-400');
    });

    it('should have small text size', () => {
      render(<LoadingScreen />);
      const message = screen.getByText('Launching your orbit...');
      expect(message).toHaveClass('text-sm');
    });
  });

  describe('layout', () => {
    it('should have full screen height', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('min-h-screen');
    });

    it('should have flex display', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex');
    });

    it('should center items vertically and horizontally', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('items-center');
      expect(wrapper).toHaveClass('justify-center');
    });

    it('should have relative positioning for z-index stacking', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative');
    });

    it('should have overflow hidden', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('overflow-hidden');
    });

    it('should have centered text in main content', () => {
      const { container } = render(<LoadingScreen />);
      const mainContent = container.querySelector('.text-center');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('background', () => {
    it('should have slate background color', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-slate-50');
    });

    it('should have background pattern container', () => {
      const { container } = render(<LoadingScreen />);
      const patternContainer = container.querySelector('.absolute.inset-0');
      expect(patternContainer).toBeInTheDocument();
    });

    it('should have orange background blur-sm element', () => {
      const { container } = render(<LoadingScreen />);
      const orangeBlur = container.querySelector('.bg-orange-200');
      expect(orangeBlur).toBeInTheDocument();
    });

    it('should have amber background blur-sm element', () => {
      const { container } = render(<LoadingScreen />);
      const amberBlur = container.querySelector('.bg-amber-200');
      expect(amberBlur).toBeInTheDocument();
    });

    it('should have blur-sm effect on background elements', () => {
      const { container } = render(<LoadingScreen />);
      const blurElements = container.querySelectorAll('.blur-3xl');
      expect(blurElements.length).toBeGreaterThan(0);
    });

    it('should have pulse animation on background elements', () => {
      const { container } = render(<LoadingScreen />);
      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('should have rounded-sm background elements', () => {
      const { container } = render(<LoadingScreen />);
      const patternContainer = container.querySelector('.absolute.inset-0');
      const roundedElements = patternContainer.querySelectorAll('.rounded-full');
      expect(roundedElements.length).toBe(2);
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode background class', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('dark:bg-black');
    });

    it('should have dark mode text color on title', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('dark:text-white');
    });

    it('should have dark mode text color on tagline', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Connect • Discover • Thrive');
      expect(tagline).toHaveClass('dark:text-neutral-400');
    });

    it('should have dark mode text color on loading message', () => {
      render(<LoadingScreen />);
      const message = screen.getByText('Launching your orbit...');
      expect(message).toHaveClass('dark:text-neutral-500');
    });

    it('should have dark mode colors on background patterns', () => {
      const { container } = render(<LoadingScreen />);
      const orangeBlur = container.querySelector('.dark\\:bg-orange-500');
      expect(orangeBlur).toBeInTheDocument();
    });
  });

  describe('transitions', () => {
    it('should have transition-colors class on main wrapper', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('transition-colors');
    });

    it('should have transition duration on main wrapper', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('duration-300');
    });

    it('should have transition-colors class on title', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('transition-colors');
    });

    it('should have transition-colors class on tagline', () => {
      render(<LoadingScreen />);
      const tagline = screen.getByText('Connect • Discover • Thrive');
      expect(tagline).toHaveClass('transition-colors');
    });

    it('should have transition-colors class on loading message', () => {
      render(<LoadingScreen />);
      const message = screen.getByText('Launching your orbit...');
      expect(message).toHaveClass('transition-colors');
    });
  });

  describe('z-index stacking', () => {
    it('should have lower opacity on background pattern', () => {
      const { container } = render(<LoadingScreen />);
      const patternContainer = container.querySelector('.opacity-30');
      expect(patternContainer).toBeInTheDocument();
    });

    it('should have z-10 on main content', () => {
      const { container } = render(<LoadingScreen />);
      const mainContent = container.querySelector('.z-10');
      expect(mainContent).toBeInTheDocument();
    });

    it('should have relative positioning on main content', () => {
      const { container } = render(<LoadingScreen />);
      const mainContent = container.querySelector('.relative.z-10');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should have responsive title size', () => {
      render(<LoadingScreen />);
      const title = screen.getByText('Orbit');
      expect(title).toHaveClass('md:text-5xl');
    });

    it('should have responsive logo size', () => {
      const { container } = render(<LoadingScreen />);
      const logoContainer = container.querySelector('.w-20.h-20');
      expect(logoContainer).toBeInTheDocument();
    });

    it('should have responsive logo text size', () => {
      render(<LoadingScreen />);
      const logo = screen.getByText('O');
      expect(logo).toHaveClass('text-3xl');
    });
  });

  describe('font', () => {
    it('should use Inter font family', () => {
      const { container } = render(<LoadingScreen />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("font-['Inter',sans-serif]");
    });
  });

  describe('loading indicator container', () => {
    it('should have fixed width on loading indicator wrapper', () => {
      const { container } = render(<LoadingScreen />);
      const loadingWrapper = container.querySelector('.w-56');
      expect(loadingWrapper).toBeInTheDocument();
    });

    it('should center the loading indicator', () => {
      const { container } = render(<LoadingScreen />);
      const loadingWrapper = container.querySelector('.w-56.mx-auto');
      expect(loadingWrapper).toBeInTheDocument();
    });
  });

  describe('logo container', () => {
    it('should have bottom margin on logo container', () => {
      const { container } = render(<LoadingScreen />);
      const logoSection = container.querySelector('.mb-8');
      expect(logoSection).toBeInTheDocument();
    });

    it('should center the logo horizontally', () => {
      const { container } = render(<LoadingScreen />);
      const logoBox = container.querySelector('.mx-auto.mb-6');
      expect(logoBox).toBeInTheDocument();
    });

    it('should have flex centering on logo box', () => {
      const { container } = render(<LoadingScreen />);
      const logoBox = container.querySelector('.flex.items-center.justify-center');
      expect(logoBox).toBeInTheDocument();
    });
  });
});
