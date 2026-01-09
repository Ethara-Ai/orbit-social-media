/**
 * Unit Tests for Array Utilities
 */

import { describe, it, expect } from 'vitest';
import { pickRandom, shuffleArray, getRandomItems, groupBy } from './arrayUtils';

describe('arrayUtils', () => {
  describe('pickRandom', () => {
    it('should return null for null input', () => {
      expect(pickRandom(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(pickRandom(undefined)).toBeNull();
    });

    it('should return null for empty array', () => {
      expect(pickRandom([])).toBeNull();
    });

    it('should return the only element for single-element array', () => {
      expect(pickRandom(['only'])).toBe('only');
    });

    it('should return an element from the array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = pickRandom(arr);
      expect(arr).toContain(result);
    });

    it('should work with different data types', () => {
      const arr = [{ a: 1 }, { b: 2 }, { c: 3 }];
      const result = pickRandom(arr);
      expect(arr).toContain(result);
    });

    it('should return different elements over multiple calls (statistical test)', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set();

      // Run multiple times to get variety
      for (let i = 0; i < 100; i++) {
        results.add(pickRandom(arr));
      }

      // Should have picked more than one unique element
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('shuffleArray', () => {
    it('should return an empty array for empty input', () => {
      expect(shuffleArray([])).toEqual([]);
    });

    it('should return array with same element for single-element array', () => {
      expect(shuffleArray([42])).toEqual([42]);
    });

    it('should return a new array (not mutate original)', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);

      expect(shuffled).toHaveLength(original.length);
      original.forEach((item) => {
        expect(shuffled).toContain(item);
      });
    });

    it('should produce different orderings (statistical test)', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set();

      // Run multiple times and collect unique orderings
      for (let i = 0; i < 50; i++) {
        results.add(JSON.stringify(shuffleArray(original)));
      }

      // Should have multiple unique orderings
      expect(results.size).toBeGreaterThan(1);
    });

    it('should work with objects', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const shuffled = shuffleArray(original);

      expect(shuffled).toHaveLength(original.length);
      original.forEach((item) => {
        expect(shuffled).toContainEqual(item);
      });
    });

    it('should work with strings', () => {
      const original = ['a', 'b', 'c', 'd', 'e'];
      const shuffled = shuffleArray(original);

      expect(shuffled).toHaveLength(original.length);
      original.forEach((item) => {
        expect(shuffled).toContain(item);
      });
    });
  });

  describe('getRandomItems', () => {
    it('should return empty array for empty input', () => {
      expect(getRandomItems([], 5)).toEqual([]);
    });

    it('should return requested number of items', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = getRandomItems(arr, 3);
      expect(result).toHaveLength(3);
    });

    it('should return all items if count exceeds array length', () => {
      const arr = [1, 2, 3];
      const result = getRandomItems(arr, 10);
      expect(result).toHaveLength(3);
    });

    it('should return unique items from the array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = getRandomItems(arr, 3);

      // All items should be from original array
      result.forEach((item) => {
        expect(arr).toContain(item);
      });

      // All items should be unique
      const uniqueResults = new Set(result);
      expect(uniqueResults.size).toBe(result.length);
    });

    it('should return zero items when count is 0', () => {
      const arr = [1, 2, 3];
      expect(getRandomItems(arr, 0)).toEqual([]);
    });

    it('should work with objects', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
      const result = getRandomItems(arr, 2);

      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(arr).toContainEqual(item);
      });
    });

    it('should not mutate original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      getRandomItems(original, 3);
      expect(original).toEqual(originalCopy);
    });
  });

  describe('groupBy', () => {
    it('should group items by string key', () => {
      const arr = [
        { category: 'fruit', name: 'apple' },
        { category: 'vegetable', name: 'carrot' },
        { category: 'fruit', name: 'banana' },
        { category: 'vegetable', name: 'broccoli' },
      ];

      const result = groupBy(arr, 'category');

      expect(result).toEqual({
        fruit: [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'banana' },
        ],
        vegetable: [
          { category: 'vegetable', name: 'carrot' },
          { category: 'vegetable', name: 'broccoli' },
        ],
      });
    });

    it('should group items by function key', () => {
      const arr = [1, 2, 3, 4, 5, 6];
      const result = groupBy(arr, (num) => (num % 2 === 0 ? 'even' : 'odd'));

      expect(result).toEqual({
        odd: [1, 3, 5],
        even: [2, 4, 6],
      });
    });

    it('should return empty object for empty array', () => {
      expect(groupBy([], 'key')).toEqual({});
    });

    it('should handle single item', () => {
      const arr = [{ type: 'a', value: 1 }];
      const result = groupBy(arr, 'type');

      expect(result).toEqual({
        a: [{ type: 'a', value: 1 }],
      });
    });

    it('should handle undefined keys', () => {
      const arr = [{ name: 'john' }, { name: 'jane', age: 25 }, { name: 'bob', age: 30 }];

      const result = groupBy(arr, 'age');

      expect(result).toEqual({
        undefined: [{ name: 'john' }],
        25: [{ name: 'jane', age: 25 }],
        30: [{ name: 'bob', age: 30 }],
      });
    });

    it('should work with complex grouping functions', () => {
      const arr = [
        { name: 'Alice', score: 85 },
        { name: 'Bob', score: 92 },
        { name: 'Charlie', score: 78 },
        { name: 'Diana', score: 95 },
      ];

      const result = groupBy(arr, (item) =>
        item.score >= 90 ? 'A' : item.score >= 80 ? 'B' : 'C'
      );

      expect(result).toEqual({
        B: [{ name: 'Alice', score: 85 }],
        A: [
          { name: 'Bob', score: 92 },
          { name: 'Diana', score: 95 },
        ],
        C: [{ name: 'Charlie', score: 78 }],
      });
    });

    it('should preserve order within groups', () => {
      const arr = [
        { group: 'a', order: 1 },
        { group: 'a', order: 2 },
        { group: 'a', order: 3 },
      ];

      const result = groupBy(arr, 'group');

      expect(result.a[0].order).toBe(1);
      expect(result.a[1].order).toBe(2);
      expect(result.a[2].order).toBe(3);
    });

    it('should handle numeric keys', () => {
      const arr = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];

      const result = groupBy(arr, 'id');

      expect(result[1]).toHaveLength(2);
      expect(result[2]).toHaveLength(1);
    });
  });
});
