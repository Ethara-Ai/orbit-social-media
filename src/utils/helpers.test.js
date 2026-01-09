/**
 * Unit Tests for Helper Utility Functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  pickRandom,
  shuffleArray,
  getRandomItems,
  formatRelativeTime,
  formatTime,
  copyToClipboard,
  isValidImage,
  truncateText,
  capitalizeFirst,
  generateId,
  debounce,
  throttle,
  isEmpty,
  deepClone,
  groupBy,
  formatNumber,
  createImageErrorHandler,
  DEFAULT_AVATAR,
  cn,
} from './helpers';

describe('pickRandom', () => {
  it('should return null for empty array', () => {
    expect(pickRandom([])).toBeNull();
  });

  it('should return null for null input', () => {
    expect(pickRandom(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(pickRandom(undefined)).toBeNull();
  });

  it('should return an item from the array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pickRandom(arr);
    expect(arr).toContain(result);
  });

  it('should return the only item for single-element array', () => {
    expect(pickRandom(['only'])).toBe('only');
  });
});

describe('shuffleArray', () => {
  it('should return an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(arr.length);
  });

  it('should contain all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    arr.forEach((item) => {
      expect(shuffled).toContain(item);
    });
  });

  it('should not modify the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(original);
  });

  it('should return empty array for empty input', () => {
    expect(shuffleArray([])).toEqual([]);
  });
});

describe('getRandomItems', () => {
  it('should return the correct number of items', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = getRandomItems(arr, 3);
    expect(result).toHaveLength(3);
  });

  it('should return all items if count exceeds array length', () => {
    const arr = [1, 2, 3];
    const result = getRandomItems(arr, 10);
    expect(result).toHaveLength(3);
  });

  it('should return items from the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = getRandomItems(arr, 2);
    result.forEach((item) => {
      expect(arr).toContain(item);
    });
  });

  it('should return empty array when count is 0', () => {
    const arr = [1, 2, 3];
    expect(getRandomItems(arr, 0)).toEqual([]);
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "Just now" for recent timestamps', () => {
    const now = new Date();
    vi.setSystemTime(now);
    const result = formatRelativeTime(now);
    expect(result).toBe('Just now');
  });

  it('should return minutes ago for timestamps within an hour', () => {
    const now = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(now);
    const tenMinutesAgo = new Date('2024-01-01T11:50:00');
    expect(formatRelativeTime(tenMinutesAgo)).toBe('10 minutes ago');
  });

  it('should return "1 minute ago" for singular', () => {
    const now = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(now);
    const oneMinuteAgo = new Date('2024-01-01T11:59:00');
    expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago');
  });

  it('should return hours ago for timestamps within a day', () => {
    const now = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(now);
    const threeHoursAgo = new Date('2024-01-01T09:00:00');
    expect(formatRelativeTime(threeHoursAgo)).toBe('3 hours ago');
  });

  it('should return "1 hour ago" for singular', () => {
    const now = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(now);
    const oneHourAgo = new Date('2024-01-01T11:00:00');
    expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
  });

  it('should return days ago for timestamps within a week', () => {
    const now = new Date('2024-01-07T12:00:00');
    vi.setSystemTime(now);
    const threeDaysAgo = new Date('2024-01-04T12:00:00');
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
  });

  it('should return weeks ago for timestamps within a month', () => {
    const now = new Date('2024-01-22T12:00:00');
    vi.setSystemTime(now);
    const twoWeeksAgo = new Date('2024-01-08T12:00:00');
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago');
  });
});

describe('formatTime', () => {
  it('should format time correctly', () => {
    const date = new Date('2024-01-01T14:30:00');
    const result = formatTime(date);
    // Result format depends on locale, but should contain hour and minute
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('should use current time when no argument provided', () => {
    const result = formatTime();
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe('copyToClipboard', () => {
  it('should return true on successful copy', async () => {
    const result = await copyToClipboard('test text');
    expect(result).toBe(true);
  });

  it('should call navigator.clipboard.writeText', async () => {
    await copyToClipboard('test text');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });

  it('should return false on error', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Failed'));
    const result = await copyToClipboard('test');
    expect(result).toBe(false);
  });
});

describe('isValidImage', () => {
  it('should return true for image files', () => {
    const imageFile = { type: 'image/png' };
    expect(isValidImage(imageFile)).toBe(true);
  });

  it('should return true for jpeg images', () => {
    const imageFile = { type: 'image/jpeg' };
    expect(isValidImage(imageFile)).toBe(true);
  });

  it('should return false for non-image files', () => {
    const textFile = { type: 'text/plain' };
    expect(isValidImage(textFile)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isValidImage(null)).toBeFalsy();
  });

  it('should return false for undefined', () => {
    expect(isValidImage(undefined)).toBeFalsy();
  });
});

describe('truncateText', () => {
  it('should truncate text longer than maxLength', () => {
    const text = 'This is a very long text that needs to be truncated';
    const result = truncateText(text, 20);
    expect(result).toBe('This is a very lo...');
    expect(result.length).toBe(20);
  });

  it('should not modify text shorter than maxLength', () => {
    const text = 'Short text';
    expect(truncateText(text, 20)).toBe('Short text');
  });

  it('should handle custom suffix', () => {
    const text = 'This is a long text';
    const result = truncateText(text, 15, '…');
    expect(result).toBe('This is a long…');
  });

  it('should return empty string for null input', () => {
    expect(truncateText(null, 10)).toBeNull();
  });

  it('should return empty string for empty input', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('capitalizeFirst', () => {
  it('should capitalize first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('should handle already capitalized strings', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  it('should return empty string for empty input', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(capitalizeFirst(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(capitalizeFirst(undefined)).toBe('');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should include prefix when provided', () => {
    const id = generateId('user');
    expect(id).toMatch(/^user-/);
  });

  it('should generate ID without prefix when not provided', () => {
    const id = generateId();
    expect(id).not.toContain('undefined');
    expect(id.length).toBeGreaterThan(0);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should only call function once for multiple rapid calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to debounced function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should use default wait time of 300ms', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn);

    debouncedFn();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call function immediately on first call', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow calls after throttle period', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    vi.advanceTimersByTime(100);
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for whitespace-only string', () => {
    expect(isEmpty('   ')).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  it('should return false for number 0', () => {
    expect(isEmpty(0)).toBe(false);
  });

  it('should return false for boolean false', () => {
    expect(isEmpty(false)).toBe(false);
  });
});

describe('deepClone', () => {
  it('should clone simple objects', () => {
    const obj = { a: 1, b: 2 };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it('should clone nested objects', () => {
    const obj = { a: { b: { c: 1 } } };
    const cloned = deepClone(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a);
    expect(cloned.a.b).not.toBe(obj.a.b);
  });

  it('should clone arrays', () => {
    const arr = [1, 2, [3, 4]];
    const cloned = deepClone(arr);
    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
  });

  it('should return primitive values as-is', () => {
    expect(deepClone(5)).toBe(5);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(null)).toBe(null);
  });
});

describe('groupBy', () => {
  it('should group by string key', () => {
    const items = [
      { category: 'fruit', name: 'apple' },
      { category: 'vegetable', name: 'carrot' },
      { category: 'fruit', name: 'banana' },
    ];
    const grouped = groupBy(items, 'category');
    expect(grouped).toEqual({
      fruit: [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'banana' },
      ],
      vegetable: [{ category: 'vegetable', name: 'carrot' }],
    });
  });

  it('should group by function', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const grouped = groupBy(items, (n) => (n % 2 === 0 ? 'even' : 'odd'));
    expect(grouped).toEqual({
      odd: [1, 3, 5],
      even: [2, 4, 6],
    });
  });

  it('should return empty object for empty array', () => {
    expect(groupBy([], 'key')).toEqual({});
  });
});

describe('formatNumber', () => {
  it('should format numbers less than 1000 as-is', () => {
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(500)).toBe('500');
  });

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(1500)).toBe('1.5K');
    expect(formatNumber(10000)).toBe('10K');
    expect(formatNumber(999999)).toBe('1000K');
  });

  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1M');
    expect(formatNumber(1500000)).toBe('1.5M');
    expect(formatNumber(10000000)).toBe('10M');
  });

  it('should remove trailing .0', () => {
    expect(formatNumber(1000)).toBe('1K');
    expect(formatNumber(2000)).toBe('2K');
    expect(formatNumber(1000000)).toBe('1M');
  });
});

describe('createImageErrorHandler', () => {
  it('should set fallback src on error', () => {
    const handler = createImageErrorHandler('fallback.jpg');
    const event = { target: { src: 'original.jpg' } };
    handler(event);
    expect(event.target.src).toBe('fallback.jpg');
  });

  it('should use default avatar when no fallback provided', () => {
    const handler = createImageErrorHandler();
    const event = { target: { src: 'original.jpg' } };
    handler(event);
    expect(event.target.src).toBe(DEFAULT_AVATAR);
  });
});

describe('DEFAULT_AVATAR', () => {
  it('should be a valid URL', () => {
    expect(DEFAULT_AVATAR).toMatch(/^https:\/\//);
  });
});

describe('cn (class name utility)', () => {
  it('should combine string class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should filter out falsy values', () => {
    expect(cn('class1', null, undefined, false, 'class2')).toBe('class1 class2');
  });

  it('should handle conditional objects', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle mixed inputs', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe(
      'btn btn-active'
    );
  });

  it('should trim whitespace', () => {
    expect(cn('  class1  ', 'class2')).toBe('class1   class2');
  });
});
