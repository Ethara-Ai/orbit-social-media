import { describe, it, expect } from 'vitest';
import { linkifyText, truncateText, capitalizeFirst, isEmpty } from './stringUtils';

describe('linkifyText', () => {
  it('should return plain text when no URLs are present', () => {
    const text = 'This is a simple text without any links';
    const result = linkifyText(text);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('text');
    expect(result[0].content).toBe(text);
  });

  it('should detect and linkify HTTP URLs', () => {
    const text = 'Check out http://example.com for more info';
    const result = linkifyText(text);

    expect(result).toHaveLength(3);
    expect(result[0].type).toBe('text');
    expect(result[0].content).toBe('Check out ');
    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('http://example.com');
    expect(result[1].href).toBe('http://example.com');
    expect(result[2].type).toBe('text');
    expect(result[2].content).toBe(' for more info');
  });

  it('should detect and linkify HTTPS URLs', () => {
    const text = 'Visit https://secure-site.com now';
    const result = linkifyText(text);

    expect(result).toHaveLength(3);
    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('https://secure-site.com');
    expect(result[1].href).toBe('https://secure-site.com');
  });

  it('should detect and linkify www URLs and add https protocol', () => {
    const text = 'Go to www.example.com today';
    const result = linkifyText(text);

    expect(result).toHaveLength(3);
    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('www.example.com');
    expect(result[1].href).toBe('https://www.example.com');
  });

  it('should detect domain URLs without protocol and add https', () => {
    const text = 'Visit example.com for details';
    const result = linkifyText(text);

    expect(result).toHaveLength(3);
    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('example.com');
    expect(result[1].href).toBe('https://example.com');
  });

  it('should handle multiple URLs in the same text', () => {
    const text = 'Check http://site1.com and https://site2.com for more';
    const result = linkifyText(text);

    expect(result).toHaveLength(5);
    expect(result[0].type).toBe('text');
    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('http://site1.com');
    expect(result[2].type).toBe('text');
    expect(result[3].type).toBe('link');
    expect(result[3].content).toBe('https://site2.com');
    expect(result[4].type).toBe('text');
  });

  it('should handle URLs at the beginning of text', () => {
    const text = 'https://example.com is a great site';
    const result = linkifyText(text);

    expect(result[0].type).toBe('link');
    expect(result[0].content).toBe('https://example.com');
  });

  it('should handle URLs at the end of text', () => {
    const text = 'Visit our site at https://example.com';
    const result = linkifyText(text);

    expect(result[result.length - 1].type).toBe('link');
    expect(result[result.length - 1].content).toBe('https://example.com');
  });

  it('should handle URLs with paths and query parameters', () => {
    const text = 'Check https://example.com/path/to/page?param=value&other=123';
    const result = linkifyText(text);

    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('https://example.com/path/to/page?param=value&other=123');
  });

  it('should handle URLs with hyphens in domain', () => {
    const text = 'Visit my-awesome-site.com today';
    const result = linkifyText(text);

    expect(result[1].type).toBe('link');
    expect(result[1].content).toBe('my-awesome-site.com');
  });

  it('should return empty array for null or undefined input', () => {
    expect(linkifyText(null)).toEqual([]);
    expect(linkifyText(undefined)).toEqual([]);
  });

  it('should return text for empty string', () => {
    const result = linkifyText('');
    expect(result).toHaveLength(0);
  });

  it('should assign unique keys to each part', () => {
    const text = 'Text https://site1.com more text https://site2.com end';
    const result = linkifyText(text);

    const keys = result.map((part) => part.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should handle text with only a URL', () => {
    const text = 'https://example.com';
    const result = linkifyText(text);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('link');
    expect(result[0].content).toBe('https://example.com');
  });

  it('should handle URLs with different TLDs', () => {
    const text = 'Visit example.co.uk and example.io and example.dev';
    const result = linkifyText(text);

    const links = result.filter((part) => part.type === 'link');
    expect(links).toHaveLength(3);
    expect(links[0].content).toBe('example.co.uk');
    expect(links[1].content).toBe('example.io');
    expect(links[2].content).toBe('example.dev');
  });
});

describe('truncateText', () => {
  it('should truncate text longer than maxLength', () => {
    const text = 'This is a long text that needs to be truncated';
    const result = truncateText(text, 20);

    expect(result).toBe('This is a long te...');
    expect(result.length).toBe(20);
  });

  it('should not truncate text shorter than maxLength', () => {
    const text = 'Short text';
    const result = truncateText(text, 20);

    expect(result).toBe('Short text');
  });

  it('should use custom suffix', () => {
    const text = 'This is a long text';
    const result = truncateText(text, 15, '---');

    expect(result).toBe('This is a lo---');
  });

  it('should handle null or undefined text', () => {
    expect(truncateText(null, 10)).toBeNull();
    expect(truncateText(undefined, 10)).toBeUndefined();
  });
});

describe('capitalizeFirst', () => {
  it('should capitalize first letter of string', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('world')).toBe('World');
  });

  it('should handle already capitalized strings', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('should handle single character strings', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should handle null or undefined', () => {
    expect(capitalizeFirst(null)).toBe('');
    expect(capitalizeFirst(undefined)).toBe('');
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

  it('should return false for numbers', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(123)).toBe(false);
  });

  it('should return false for boolean', () => {
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(true)).toBe(false);
  });
});
