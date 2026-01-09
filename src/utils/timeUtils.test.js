/**
 * Unit Tests for Time Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, formatTime } from './timeUtils';

describe('timeUtils', () => {
  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Set a fixed date for consistent testing
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('just now (< 60 seconds)', () => {
      it('should return "Just now" for current time', () => {
        const now = new Date();
        expect(formatRelativeTime(now)).toBe('Just now');
      });

      it('should return "Just now" for 30 seconds ago', () => {
        const time = new Date('2024-06-15T11:59:30.000Z');
        expect(formatRelativeTime(time)).toBe('Just now');
      });

      it('should return "Just now" for 59 seconds ago', () => {
        const time = new Date('2024-06-15T11:59:01.000Z');
        expect(formatRelativeTime(time)).toBe('Just now');
      });
    });

    describe('minutes ago (1-59 minutes)', () => {
      it('should return "1 minute ago" for exactly 1 minute ago', () => {
        const time = new Date('2024-06-15T11:59:00.000Z');
        expect(formatRelativeTime(time)).toBe('1 minute ago');
      });

      it('should return "2 minutes ago" for 2 minutes ago', () => {
        const time = new Date('2024-06-15T11:58:00.000Z');
        expect(formatRelativeTime(time)).toBe('2 minutes ago');
      });

      it('should return "30 minutes ago" for 30 minutes ago', () => {
        const time = new Date('2024-06-15T11:30:00.000Z');
        expect(formatRelativeTime(time)).toBe('30 minutes ago');
      });

      it('should return "59 minutes ago" for 59 minutes ago', () => {
        const time = new Date('2024-06-15T11:01:00.000Z');
        expect(formatRelativeTime(time)).toBe('59 minutes ago');
      });

      it('should use singular form for 1 minute', () => {
        const time = new Date('2024-06-15T11:59:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('minute');
        expect(result).not.toContain('minutes');
      });

      it('should use plural form for multiple minutes', () => {
        const time = new Date('2024-06-15T11:55:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('minutes');
      });
    });

    describe('hours ago (1-23 hours)', () => {
      it('should return "1 hour ago" for exactly 1 hour ago', () => {
        const time = new Date('2024-06-15T11:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('1 hour ago');
      });

      it('should return "2 hours ago" for 2 hours ago', () => {
        const time = new Date('2024-06-15T10:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('2 hours ago');
      });

      it('should return "12 hours ago" for 12 hours ago', () => {
        const time = new Date('2024-06-15T00:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('12 hours ago');
      });

      it('should return "23 hours ago" for 23 hours ago', () => {
        const time = new Date('2024-06-14T13:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('23 hours ago');
      });

      it('should use singular form for 1 hour', () => {
        const time = new Date('2024-06-15T11:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('hour');
        expect(result).not.toContain('hours');
      });

      it('should use plural form for multiple hours', () => {
        const time = new Date('2024-06-15T09:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('hours');
      });
    });

    describe('days ago (1-6 days)', () => {
      it('should return "1 day ago" for exactly 1 day ago', () => {
        const time = new Date('2024-06-14T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('1 day ago');
      });

      it('should return "2 days ago" for 2 days ago', () => {
        const time = new Date('2024-06-13T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('2 days ago');
      });

      it('should return "6 days ago" for 6 days ago', () => {
        const time = new Date('2024-06-09T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('6 days ago');
      });

      it('should use singular form for 1 day', () => {
        const time = new Date('2024-06-14T12:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('day');
        expect(result).not.toContain('days');
      });

      it('should use plural form for multiple days', () => {
        const time = new Date('2024-06-12T12:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('days');
      });
    });

    describe('weeks ago (1-4 weeks)', () => {
      it('should return "1 week ago" for exactly 1 week ago', () => {
        const time = new Date('2024-06-08T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('1 week ago');
      });

      it('should return "2 weeks ago" for 2 weeks ago', () => {
        const time = new Date('2024-06-01T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('2 weeks ago');
      });

      it('should return "3 weeks ago" for 3 weeks ago', () => {
        const time = new Date('2024-05-25T12:00:00.000Z');
        expect(formatRelativeTime(time)).toBe('3 weeks ago');
      });

      it('should use singular form for 1 week', () => {
        const time = new Date('2024-06-08T12:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('week');
        expect(result).not.toContain('weeks');
      });

      it('should use plural form for multiple weeks', () => {
        const time = new Date('2024-06-01T12:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).toContain('weeks');
      });
    });

    describe('older dates (> 30 days)', () => {
      it('should return locale date string for dates older than 30 days', () => {
        const time = new Date('2024-05-01T12:00:00.000Z');
        const result = formatRelativeTime(time);
        // Should be a formatted date, not a relative time
        expect(result).not.toContain('ago');
        expect(result).not.toBe('Just now');
      });

      it('should return locale date string for very old dates', () => {
        const time = new Date('2023-01-01T12:00:00.000Z');
        const result = formatRelativeTime(time);
        expect(result).not.toContain('ago');
      });
    });

    describe('different input types', () => {
      it('should handle Date object', () => {
        const time = new Date('2024-06-15T11:30:00.000Z');
        expect(formatRelativeTime(time)).toBe('30 minutes ago');
      });

      it('should handle ISO string', () => {
        const time = '2024-06-15T11:30:00.000Z';
        expect(formatRelativeTime(time)).toBe('30 minutes ago');
      });

      it('should handle timestamp number', () => {
        const time = new Date('2024-06-15T11:30:00.000Z').getTime();
        expect(formatRelativeTime(time)).toBe('30 minutes ago');
      });
    });
  });

  describe('formatTime', () => {
    it('should format current time when no argument provided', () => {
      const result = formatTime();
      // Result should be a time string in HH:MM format
      expect(result).toMatch(/^\d{1,2}:\d{2}\s?(AM|PM)?$/i);
    });

    it('should format a specific Date object', () => {
      const date = new Date('2024-06-15T14:30:00');
      const result = formatTime(date);
      // Should contain hour and minute
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format morning time', () => {
      const date = new Date('2024-06-15T09:15:00');
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format evening time', () => {
      const date = new Date('2024-06-15T21:45:00');
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format midnight', () => {
      const date = new Date('2024-06-15T00:00:00');
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format noon', () => {
      const date = new Date('2024-06-15T12:00:00');
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle edge case times', () => {
      // 11:59 PM
      const lateNight = new Date('2024-06-15T23:59:00');
      expect(formatTime(lateNight)).toMatch(/\d{1,2}:\d{2}/);

      // 12:01 AM
      const earlyMorning = new Date('2024-06-15T00:01:00');
      expect(formatTime(earlyMorning)).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should return consistent format', () => {
      const date1 = new Date('2024-06-15T08:00:00');
      const date2 = new Date('2024-06-15T20:00:00');

      const result1 = formatTime(date1);
      const result2 = formatTime(date2);

      // Both should follow same format pattern
      const formatPattern = /^\d{1,2}:\d{2}\s?(AM|PM)?$/i;
      expect(result1).toMatch(formatPattern);
      expect(result2).toMatch(formatPattern);
    });

    it('should use 2-digit formatting', () => {
      const date = new Date('2024-06-15T09:05:00');
      const result = formatTime(date);
      // Minutes should have 2 digits (05, not 5)
      expect(result).toContain(':0') || expect(result).toMatch(/:\d{2}/);
    });
  });
});
