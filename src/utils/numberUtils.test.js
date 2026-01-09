/**
 * Unit Tests for Number Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatNumber, generateId } from './numberUtils';

describe('numberUtils', () => {
  describe('formatNumber', () => {
    describe('numbers below 1000', () => {
      it('should return "0" for zero', () => {
        expect(formatNumber(0)).toBe('0');
      });

      it('should return the number as a string for single digits', () => {
        expect(formatNumber(5)).toBe('5');
      });

      it('should return the number as a string for double digits', () => {
        expect(formatNumber(42)).toBe('42');
      });

      it('should return the number as a string for triple digits', () => {
        expect(formatNumber(999)).toBe('999');
      });

      it('should handle negative numbers below 1000', () => {
        expect(formatNumber(-500)).toBe('-500');
      });
    });

    describe('numbers in thousands (K)', () => {
      it('should format exactly 1000 as "1K"', () => {
        expect(formatNumber(1000)).toBe('1K');
      });

      it('should format 1500 as "1.5K"', () => {
        expect(formatNumber(1500)).toBe('1.5K');
      });

      it('should format 2000 as "2K" (removing trailing .0)', () => {
        expect(formatNumber(2000)).toBe('2K');
      });

      it('should format 10000 as "10K"', () => {
        expect(formatNumber(10000)).toBe('10K');
      });

      it('should format 15300 as "15.3K"', () => {
        expect(formatNumber(15300)).toBe('15.3K');
      });

      it('should format 999999 as "1000K"', () => {
        expect(formatNumber(999999)).toBe('1000K');
      });

      it('should format 123456 as "123.5K"', () => {
        expect(formatNumber(123456)).toBe('123.5K');
      });

      it('should round to one decimal place', () => {
        expect(formatNumber(1234)).toBe('1.2K');
        expect(formatNumber(1250)).toBe('1.3K');
      });
    });

    describe('numbers in millions (M)', () => {
      it('should format exactly 1000000 as "1M"', () => {
        expect(formatNumber(1000000)).toBe('1M');
      });

      it('should format 1500000 as "1.5M"', () => {
        expect(formatNumber(1500000)).toBe('1.5M');
      });

      it('should format 2000000 as "2M" (removing trailing .0)', () => {
        expect(formatNumber(2000000)).toBe('2M');
      });

      it('should format 10000000 as "10M"', () => {
        expect(formatNumber(10000000)).toBe('10M');
      });

      it('should format 123456789 as "123.5M"', () => {
        expect(formatNumber(123456789)).toBe('123.5M');
      });

      it('should round to one decimal place', () => {
        expect(formatNumber(1234567)).toBe('1.2M');
        expect(formatNumber(1250000)).toBe('1.3M');
      });
    });

    describe('edge cases', () => {
      it('should handle very large numbers', () => {
        expect(formatNumber(1000000000)).toBe('1000M');
      });

      it('should handle decimal input', () => {
        expect(formatNumber(1500.5)).toBe('1.5K');
      });
    });
  });

  describe('generateId', () => {
    beforeEach(() => {
      vi.spyOn(Date, 'now').mockReturnValue(1234567890123);
      vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('without prefix', () => {
      it('should generate an ID in the format "timestamp-random" when no prefix provided', () => {
        vi.restoreAllMocks();
        const id = generateId();
        const parts = id.split('-');
        expect(parts.length).toBe(2);
        expect(parts[0]).toBeTruthy();
        expect(parts[1]).toBeTruthy();
      });

      it('should generate an ID with empty string prefix (same as no prefix)', () => {
        vi.restoreAllMocks();
        const id = generateId('');
        const parts = id.split('-');
        expect(parts.length).toBe(2);
      });

      it('should contain alphanumeric characters', () => {
        vi.restoreAllMocks();
        const id = generateId();
        expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
      });
    });

    describe('with prefix', () => {
      it('should include the prefix at the start of the ID', () => {
        vi.restoreAllMocks();
        const id = generateId('user');
        expect(id.startsWith('user-')).toBe(true);
      });

      it('should generate an ID in the format "prefix-timestamp-random"', () => {
        vi.restoreAllMocks();
        const id = generateId('post');
        const parts = id.split('-');
        expect(parts.length).toBe(3);
        expect(parts[0]).toBe('post');
        expect(parts[1]).toBeTruthy();
        expect(parts[2]).toBeTruthy();
      });

      it('should work with various prefix values', () => {
        vi.restoreAllMocks();
        expect(generateId('comment').startsWith('comment-')).toBe(true);
        expect(generateId('msg').startsWith('msg-')).toBe(true);
        expect(generateId('notification').startsWith('notification-')).toBe(true);
      });

      it('should handle prefix with special characters', () => {
        vi.restoreAllMocks();
        const id = generateId('test_prefix');
        expect(id.startsWith('test_prefix-')).toBe(true);
      });
    });

    describe('uniqueness', () => {
      it('should generate unique IDs on subsequent calls', () => {
        vi.restoreAllMocks();
        const ids = new Set();
        for (let i = 0; i < 100; i++) {
          ids.add(generateId());
        }
        expect(ids.size).toBe(100);
      });

      it('should generate unique IDs with the same prefix', () => {
        vi.restoreAllMocks();
        const ids = new Set();
        for (let i = 0; i < 100; i++) {
          ids.add(generateId('test'));
        }
        expect(ids.size).toBe(100);
      });
    });

    describe('format validation', () => {
      it('should only contain alphanumeric characters and hyphens', () => {
        vi.restoreAllMocks();
        const id = generateId('user');
        expect(id).toMatch(/^[a-z0-9-]+$/);
      });

      it('should have reasonable length', () => {
        vi.restoreAllMocks();
        const idWithoutPrefix = generateId();
        const idWithPrefix = generateId('user');

        // ID should be reasonable length (timestamp in base36 + random part)
        expect(idWithoutPrefix.length).toBeGreaterThan(10);
        expect(idWithoutPrefix.length).toBeLessThan(30);
        expect(idWithPrefix.length).toBeGreaterThan(15);
        expect(idWithPrefix.length).toBeLessThan(35);
      });
    });
  });
});
