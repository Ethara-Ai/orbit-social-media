/**
 * Unit Tests for File Utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  readFileAsDataUrl,
  isValidImage,
  processImageFile,
  DEFAULT_AVATAR,
  createImageErrorHandler,
} from './fileUtils';

describe('fileUtils', () => {
  describe('readFileAsDataUrl', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return null for null input', async () => {
      const result = await readFileAsDataUrl(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', async () => {
      const result = await readFileAsDataUrl(undefined);
      expect(result).toBeNull();
    });

    it('should return null for falsy input', async () => {
      const result = await readFileAsDataUrl(false);
      expect(result).toBeNull();
    });

    it('should return null for empty string input', async () => {
      const result = await readFileAsDataUrl('');
      expect(result).toBeNull();
    });
  });

  describe('isValidImage', () => {
    it('should return true for image/png type', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return true for image/jpeg type', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return true for image/gif type', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return true for image/webp type', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return true for image/svg+xml type', () => {
      const file = new File([''], 'test.svg', { type: 'image/svg+xml' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return false for non-image types', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' });
      expect(isValidImage(file)).toBe(false);
    });

    it('should return false for text files', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      expect(isValidImage(file)).toBe(false);
    });

    it('should return false for video files', () => {
      const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      expect(isValidImage(file)).toBe(false);
    });

    it('should return falsy for null input', () => {
      expect(isValidImage(null)).toBeFalsy();
    });

    it('should return falsy for undefined input', () => {
      expect(isValidImage(undefined)).toBeFalsy();
    });

    it('should handle file without type property', () => {
      const file = { name: 'test.unknown' };
      // The implementation expects file.type to exist, so this throws
      expect(() => isValidImage(file)).toThrow();
    });

    it('should handle empty object', () => {
      // The implementation expects file.type to exist, so this throws
      expect(() => isValidImage({})).toThrow();
    });

    it('should return true for image/bmp type', () => {
      const file = new File([''], 'test.bmp', { type: 'image/bmp' });
      expect(isValidImage(file)).toBe(true);
    });

    it('should return true for image/tiff type', () => {
      const file = new File([''], 'test.tiff', { type: 'image/tiff' });
      expect(isValidImage(file)).toBe(true);
    });
  });

  describe('processImageFile', () => {
    it('should return null for non-image file', async () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const result = await processImageFile(file);
      expect(result).toBeNull();
    });

    it('should return null for null input', async () => {
      const result = await processImageFile(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', async () => {
      const result = await processImageFile(undefined);
      expect(result).toBeNull();
    });

    it('should return null for pdf file', async () => {
      const file = new File([''], 'document.pdf', { type: 'application/pdf' });
      const result = await processImageFile(file);
      expect(result).toBeNull();
    });

    it('should return null for video file', async () => {
      const file = new File([''], 'video.mp4', { type: 'video/mp4' });
      const result = await processImageFile(file);
      expect(result).toBeNull();
    });

    it('should return null for audio file', async () => {
      const file = new File([''], 'audio.mp3', { type: 'audio/mpeg' });
      const result = await processImageFile(file);
      expect(result).toBeNull();
    });
  });

  describe('DEFAULT_AVATAR', () => {
    it('should be a valid URL string', () => {
      expect(typeof DEFAULT_AVATAR).toBe('string');
      expect(DEFAULT_AVATAR).toContain('https://');
    });

    it('should be an Unsplash image URL', () => {
      expect(DEFAULT_AVATAR).toContain('unsplash.com');
    });

    it('should have crop parameters for face', () => {
      expect(DEFAULT_AVATAR).toContain('crop=face');
    });

    it('should have size parameters', () => {
      expect(DEFAULT_AVATAR).toContain('w=50');
      expect(DEFAULT_AVATAR).toContain('h=50');
    });

    it('should have fit parameter', () => {
      expect(DEFAULT_AVATAR).toContain('fit=crop');
    });
  });

  describe('createImageErrorHandler', () => {
    it('should return a function', () => {
      const handler = createImageErrorHandler();
      expect(typeof handler).toBe('function');
    });

    it('should set target src to default avatar when called without fallback', () => {
      const handler = createImageErrorHandler();
      const mockEvent = {
        target: {
          src: 'broken-image.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe(DEFAULT_AVATAR);
    });

    it('should set target src to provided fallback', () => {
      const customFallback = 'https://example.com/custom-avatar.png';
      const handler = createImageErrorHandler(customFallback);
      const mockEvent = {
        target: {
          src: 'broken-image.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe(customFallback);
    });

    it('should handle empty string fallback', () => {
      const handler = createImageErrorHandler('');
      const mockEvent = {
        target: {
          src: 'broken-image.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe('');
    });

    it('should work with relative URL fallback', () => {
      const relativeFallback = '/images/default-avatar.png';
      const handler = createImageErrorHandler(relativeFallback);
      const mockEvent = {
        target: {
          src: 'broken-image.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe(relativeFallback);
    });

    it('should handle data URL as fallback', () => {
      const dataUrlFallback = 'data:image/png;base64,abc123';
      const handler = createImageErrorHandler(dataUrlFallback);
      const mockEvent = {
        target: {
          src: 'broken-image.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe(dataUrlFallback);
    });

    it('should modify the original event target', () => {
      const handler = createImageErrorHandler();
      const mockTarget = { src: 'original.jpg' };
      const mockEvent = { target: mockTarget };

      handler(mockEvent);

      expect(mockTarget.src).toBe(DEFAULT_AVATAR);
    });

    it('should work with placeholder path fallback', () => {
      const placeholderPath = '/placeholder.svg';
      const handler = createImageErrorHandler(placeholderPath);
      const mockEvent = {
        target: {
          src: 'missing.jpg',
        },
      };

      handler(mockEvent);

      expect(mockEvent.target.src).toBe(placeholderPath);
    });
  });
});
