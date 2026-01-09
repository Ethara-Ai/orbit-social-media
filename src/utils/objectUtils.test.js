/**
 * Unit Tests for Object Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { deepClone, debounce, throttle } from './objectUtils';

describe('objectUtils', () => {
  describe('deepClone', () => {
    it('should return null for null input', () => {
      expect(deepClone(null)).toBeNull();
    });

    it('should return undefined for undefined input', () => {
      expect(deepClone(undefined)).toBeUndefined();
    });

    it('should return primitive values as-is', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(false)).toBe(false);
    });

    it('should create a deep copy of a simple object', () => {
      const original = { name: 'John', age: 30 };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should create a deep copy of nested objects', () => {
      const original = {
        user: {
          name: 'John',
          address: {
            city: 'New York',
            zip: '10001',
          },
        },
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.user).not.toBe(original.user);
      expect(cloned.user.address).not.toBe(original.user.address);
    });

    it('should create a deep copy of arrays', () => {
      const original = [1, 2, [3, 4, [5, 6]]];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
      expect(cloned[2][2]).not.toBe(original[2][2]);
    });

    it('should create a deep copy of objects with arrays', () => {
      const original = {
        tags: ['react', 'javascript'],
        items: [{ id: 1 }, { id: 2 }],
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned.tags).not.toBe(original.tags);
      expect(cloned.items).not.toBe(original.items);
      expect(cloned.items[0]).not.toBe(original.items[0]);
    });

    it('should not affect original when modifying clone', () => {
      const original = { nested: { value: 'original' } };
      const cloned = deepClone(original);

      cloned.nested.value = 'modified';

      expect(original.nested.value).toBe('original');
      expect(cloned.nested.value).toBe('modified');
    });

    it('should handle empty objects', () => {
      const original = {};
      const cloned = deepClone(original);

      expect(cloned).toEqual({});
      expect(cloned).not.toBe(original);
    });

    it('should handle empty arrays', () => {
      const original = [];
      const cloned = deepClone(original);

      expect(cloned).toEqual([]);
      expect(cloned).not.toBe(original);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should not call function immediately', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn();

      expect(fn).not.toHaveBeenCalled();
    });

    it('should call function after specified delay', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn();
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use default delay of 300ms', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn);

      debouncedFn();

      vi.advanceTimersByTime(299);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn();
      vi.advanceTimersByTime(200);

      debouncedFn();
      vi.advanceTimersByTime(200);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('arg1', 'arg2', { key: 'value' });
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
    });

    it('should only use the last call arguments when called multiple times', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      debouncedFn('first');
      vi.advanceTimersByTime(100);
      debouncedFn('second');
      vi.advanceTimersByTime(100);
      debouncedFn('third');
      vi.advanceTimersByTime(300);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('third');
    });

    it('should work with zero delay', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 0);

      debouncedFn();
      vi.advanceTimersByTime(0);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid consecutive calls', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 300);

      for (let i = 0; i < 10; i++) {
        debouncedFn(i);
        vi.advanceTimersByTime(50);
      }

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(9);
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
      const throttledFn = throttle(fn, 300);

      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call function again within throttle limit', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 300);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should allow function call after throttle limit expires', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 300);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(300);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use default limit of 300ms', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(299);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to the throttled function', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 300);

      throttledFn('arg1', 'arg2');

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should ignore calls during throttle period', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 300);

      throttledFn('first');
      vi.advanceTimersByTime(100);
      throttledFn('second');
      vi.advanceTimersByTime(100);
      throttledFn('third');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('first');
    });

    it('should work with zero limit', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 0);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(0);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple throttle cycles', () => {
      const fn = vi.fn();
      const throttledFn = throttle(fn, 100);

      // First cycle
      throttledFn('a');
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      // Second cycle
      throttledFn('b');
      expect(fn).toHaveBeenCalledTimes(2);

      vi.advanceTimersByTime(100);

      // Third cycle
      throttledFn('c');
      expect(fn).toHaveBeenCalledTimes(3);

      expect(fn).toHaveBeenNthCalledWith(1, 'a');
      expect(fn).toHaveBeenNthCalledWith(2, 'b');
      expect(fn).toHaveBeenNthCalledWith(3, 'c');
    });
  });
});
