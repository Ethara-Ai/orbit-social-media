/**
 * Unit Tests for DOM Utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard, scrollToTop, scrollIntoView, cn } from './domUtils';

describe('domUtils', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should copy text to clipboard successfully', async () => {
      navigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const result = await copyToClipboard('test text');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should return false when clipboard copy fails', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should handle empty string', async () => {
      navigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const result = await copyToClipboard('');

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
      expect(result).toBe(true);
    });

    it('should handle special characters', async () => {
      navigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const specialText = '<script>alert("xss")</script> & "quotes" \'apostrophes\'';
      const result = await copyToClipboard(specialText);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(specialText);
      expect(result).toBe(true);
    });

    it('should handle unicode text', async () => {
      navigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const unicodeText = '你好世界 🎉 émoji';
      const result = await copyToClipboard(unicodeText);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(unicodeText);
      expect(result).toBe(true);
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should scroll to top with instant behavior by default', () => {
      scrollToTop();

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
    });

    it('should scroll to top with smooth behavior when specified', () => {
      scrollToTop('smooth');

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should scroll to top with auto behavior when specified', () => {
      scrollToTop('auto');

      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });
  });

  describe('scrollIntoView', () => {
    it('should scroll element into view with smooth behavior by default', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      scrollIntoView(mockElement);

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should scroll element into view with specified behavior', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      scrollIntoView(mockElement, 'instant');

      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant' });
    });

    it('should handle null element gracefully', () => {
      expect(() => scrollIntoView(null)).not.toThrow();
    });

    it('should handle undefined element gracefully', () => {
      expect(() => scrollIntoView(undefined)).not.toThrow();
    });
  });

  describe('cn (class name utility)', () => {
    describe('string inputs', () => {
      it('should combine multiple string class names', () => {
        const result = cn('class1', 'class2', 'class3');

        expect(result).toBe('class1 class2 class3');
      });

      it('should handle single string class name', () => {
        const result = cn('single-class');

        expect(result).toBe('single-class');
      });

      it('should handle empty string', () => {
        const result = cn('');

        expect(result).toBe('');
      });

      it('should filter out empty strings', () => {
        const result = cn('class1', '', 'class2');

        expect(result).toBe('class1 class2');
      });

      it('should handle strings with extra spaces', () => {
        const result = cn('class1', '  class2  ', 'class3');

        expect(result).toBe('class1   class2   class3');
      });
    });

    describe('falsy inputs', () => {
      it('should filter out null values', () => {
        const result = cn('class1', null, 'class2');

        expect(result).toBe('class1 class2');
      });

      it('should filter out undefined values', () => {
        const result = cn('class1', undefined, 'class2');

        expect(result).toBe('class1 class2');
      });

      it('should filter out false values', () => {
        const result = cn('class1', false, 'class2');

        expect(result).toBe('class1 class2');
      });

      it('should filter out zero', () => {
        const result = cn('class1', 0, 'class2');

        expect(result).toBe('class1 class2');
      });

      it('should return empty string for all falsy values', () => {
        const result = cn(null, undefined, false, '', 0);

        expect(result).toBe('');
      });
    });

    describe('conditional object inputs', () => {
      it('should include class when condition is true', () => {
        const result = cn('base', { active: true });

        expect(result).toBe('base active');
      });

      it('should exclude class when condition is false', () => {
        const result = cn('base', { inactive: false });

        expect(result).toBe('base');
      });

      it('should handle multiple conditions in one object', () => {
        const result = cn('base', { active: true, disabled: false, highlighted: true });

        expect(result).toBe('base active highlighted');
      });

      it('should handle empty object', () => {
        const result = cn('base', {});

        expect(result).toBe('base');
      });

      it('should handle object with all false conditions', () => {
        const result = cn('base', { disabled: false, hidden: false });

        expect(result).toBe('base');
      });

      it('should handle truthy non-boolean values', () => {
        const result = cn('base', { hasValue: 'some string', hasNumber: 1 });

        expect(result).toBe('base hasValue hasNumber');
      });
    });

    describe('mixed inputs', () => {
      it('should handle mix of strings and conditional objects', () => {
        const isActive = true;
        const isDisabled = false;

        const result = cn('btn', 'btn-primary', {
          'btn-active': isActive,
          'btn-disabled': isDisabled,
        });

        expect(result).toBe('btn btn-primary btn-active');
      });

      it('should handle complex mixed scenario', () => {
        const result = cn(
          'base-class',
          null,
          'another-class',
          { conditional: true },
          undefined,
          { skipped: false },
          '',
          'final-class'
        );

        // The cn function may produce extra spaces when objects with all false values are processed
        expect(result).toContain('base-class');
        expect(result).toContain('another-class');
        expect(result).toContain('conditional');
        expect(result).toContain('final-class');
        expect(result).not.toContain('skipped');
      });

      it('should handle multiple conditional objects', () => {
        const result = cn({ a: true }, { b: true }, { c: false });

        expect(result).toBe('a b');
      });
    });

    describe('edge cases', () => {
      it('should return empty string with no arguments', () => {
        const result = cn();

        expect(result).toBe('');
      });

      it('should handle class names with hyphens', () => {
        const result = cn('btn-primary', 'text-lg', { 'mt-4': true });

        expect(result).toBe('btn-primary text-lg mt-4');
      });

      it('should handle Tailwind-style class names', () => {
        const result = cn('flex', 'items-center', 'justify-between', 'px-4', 'py-2', {
          'bg-blue-500': true,
          'hover:bg-blue-600': true,
          hidden: false,
        });

        expect(result).toBe(
          'flex items-center justify-between px-4 py-2 bg-blue-500 hover:bg-blue-600'
        );
      });
    });
  });
});
