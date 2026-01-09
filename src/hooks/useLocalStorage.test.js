/**
 * Unit Tests for useLocalStorage Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initial value', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('should return stored value when localStorage has data', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify('stored-value'));
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
      expect(result.current[0]).toBe('stored-value');
    });

    it('should handle object initial values', () => {
      const initialValue = { name: 'test', count: 0 };
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialValue));
      expect(result.current[0]).toEqual(initialValue);
    });

    it('should handle array initial values', () => {
      const initialValue = [1, 2, 3];
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialValue));
      expect(result.current[0]).toEqual(initialValue);
    });

    it('should handle null initial value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, null));
      expect(result.current[0]).toBeNull();
    });

    it('should handle boolean initial values', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, false));
      expect(result.current[0]).toBe(false);
    });

    it('should handle number initial values', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 42));
      expect(result.current[0]).toBe(42);
    });

    it('should parse stored JSON objects correctly', () => {
      const storedObject = { id: 1, name: 'test', active: true };
      localStorage.setItem(TEST_KEY, JSON.stringify(storedObject));
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, {}));
      expect(result.current[0]).toEqual(storedObject);
    });

    it('should parse stored JSON arrays correctly', () => {
      const storedArray = ['a', 'b', 'c'];
      localStorage.setItem(TEST_KEY, JSON.stringify(storedArray));
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, []));
      expect(result.current[0]).toEqual(storedArray);
    });

    it('should return initial value when stored JSON is invalid', () => {
      localStorage.setItem(TEST_KEY, 'invalid-json{');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'default'));
      expect(result.current[0]).toBe('default');
      consoleSpy.mockRestore();
    });
  });

  describe('setValue', () => {
    it('should update state with new value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('should persist value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('persisted');
      });

      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('persisted'));
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 5));

      act(() => {
        result.current[1]((prev) => prev + 10);
      });

      expect(result.current[0]).toBe(15);
    });

    it('should handle function updates with objects', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, { count: 0 }));

      act(() => {
        result.current[1]((prev) => ({ ...prev, count: prev.count + 1 }));
      });

      expect(result.current[0]).toEqual({ count: 1 });
    });

    it('should handle function updates with arrays', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, [1, 2]));

      act(() => {
        result.current[1]((prev) => [...prev, 3]);
      });

      expect(result.current[0]).toEqual([1, 2, 3]);
    });

    it('should update localStorage on multiple setValue calls', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));

      act(() => {
        result.current[1](1);
      });
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(1));

      act(() => {
        result.current[1](2);
      });
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(2));
    });

    it('should handle setting value to null', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1](null);
      });

      expect(result.current[0]).toBeNull();
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(null));
    });

    it('should handle setting value to undefined', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBeUndefined();
    });

    it('should handle setting complex nested objects', () => {
      const complexObject = {
        user: {
          profile: {
            name: 'Test',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        items: [1, 2, { nested: true }],
      };

      const { result } = renderHook(() => useLocalStorage(TEST_KEY, {}));

      act(() => {
        result.current[1](complexObject);
      });

      expect(result.current[0]).toEqual(complexObject);
      expect(JSON.parse(localStorage.getItem(TEST_KEY))).toEqual(complexObject);
    });
  });

  describe('removeValue', () => {
    it('should reset state to initial value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('changed');
      });
      expect(result.current[0]).toBe('changed');

      act(() => {
        result.current[2]();
      });
      expect(result.current[0]).toBe('initial');
    });

    it('should remove item from localStorage', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('stored');
      });
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('stored'));

      act(() => {
        result.current[2]();
      });
      expect(localStorage.getItem(TEST_KEY)).toBeNull();
    });

    it('should work with object initial values', () => {
      const initialValue = { id: 1, name: 'test' };
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialValue));

      act(() => {
        result.current[1]({ id: 2, name: 'updated' });
      });

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toEqual(initialValue);
    });
  });

  describe('cross-tab synchronization', () => {
    it('should update value when storage event is fired', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        // Simulate storage event from another tab
        const event = new StorageEvent('storage', {
          key: TEST_KEY,
          newValue: JSON.stringify('from-other-tab'),
        });
        window.dispatchEvent(event);
      });

      expect(result.current[0]).toBe('from-other-tab');
    });

    it('should reset to initial value when storage event has null newValue', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('changed');
      });
      expect(result.current[0]).toBe('changed');

      act(() => {
        // Simulate removal from another tab
        const event = new StorageEvent('storage', {
          key: TEST_KEY,
          newValue: null,
        });
        window.dispatchEvent(event);
      });

      expect(result.current[0]).toBe('initial');
    });

    it('should not update when storage event is for different key', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('changed');
      });

      act(() => {
        const event = new StorageEvent('storage', {
          key: 'different-key',
          newValue: JSON.stringify('other-value'),
        });
        window.dispatchEvent(event);
      });

      expect(result.current[0]).toBe('changed');
    });

    it('should handle invalid JSON in storage event gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        const event = new StorageEvent('storage', {
          key: TEST_KEY,
          newValue: 'invalid-json{',
        });
        window.dispatchEvent(event);
      });

      // Should maintain current value on parse error
      expect(result.current[0]).toBe('initial');
      consoleSpy.mockRestore();
    });

    it('should cleanup storage event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('different keys', () => {
    it('should handle multiple hooks with different keys independently', () => {
      const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'));
      const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'));

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toBe('value2');

      act(() => {
        result1.current[1]('updated1');
      });

      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2');
    });

    it('should not affect other keys when removing value', () => {
      localStorage.setItem('key1', JSON.stringify('stored1'));
      localStorage.setItem('key2', JSON.stringify('stored2'));

      const { result } = renderHook(() => useLocalStorage('key1', 'default1'));

      act(() => {
        result.current[2]();
      });

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBe(JSON.stringify('stored2'));
    });
  });

  describe('error handling', () => {
    it('should handle localStorage.setItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('new-value');
      });

      // State should still update even if localStorage fails
      expect(result.current[0]).toBe('new-value');
      expect(consoleSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should handle localStorage.getItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'fallback'));

      expect(result.current[0]).toBe('fallback');

      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should handle localStorage.removeItem throwing an error', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

      act(() => {
        result.current[1]('changed');
      });

      act(() => {
        result.current[2]();
      });

      // State should still reset even if localStorage fails
      expect(result.current[0]).toBe('initial');

      removeItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('return value structure', () => {
    it('should return an array with three elements', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
      expect(result.current).toHaveLength(3);
    });

    it('should return storedValue as first element', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
      expect(result.current[0]).toBe('initial');
    });

    it('should return setValue function as second element', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
      expect(typeof result.current[1]).toBe('function');
    });

    it('should return removeValue function as third element', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
      expect(typeof result.current[2]).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string as key', () => {
      const { result } = renderHook(() => useLocalStorage('', 'value'));
      expect(result.current[0]).toBe('value');

      act(() => {
        result.current[1]('new-value');
      });

      expect(localStorage.getItem('')).toBe(JSON.stringify('new-value'));
    });

    it('should handle empty string as value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, ''));
      expect(result.current[0]).toBe('');
    });

    it('should handle zero as value', () => {
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));
      expect(result.current[0]).toBe(0);

      act(() => {
        result.current[1](0);
      });

      expect(result.current[0]).toBe(0);
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(0));
    });

    it('should handle false as value', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify(false));
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, true));
      expect(result.current[0]).toBe(false);
    });

    it('should handle special characters in key', () => {
      const specialKey = 'test:key/with.special-chars';
      const { result } = renderHook(() => useLocalStorage(specialKey, 'value'));

      act(() => {
        result.current[1]('special-value');
      });

      expect(localStorage.getItem(specialKey)).toBe(JSON.stringify('special-value'));
    });

    it('should handle unicode characters in value', () => {
      const unicodeValue = '日本語 🎉 émoji';
      const { result } = renderHook(() => useLocalStorage(TEST_KEY, ''));

      act(() => {
        result.current[1](unicodeValue);
      });

      expect(result.current[0]).toBe(unicodeValue);
      expect(JSON.parse(localStorage.getItem(TEST_KEY))).toBe(unicodeValue);
    });
  });
});
