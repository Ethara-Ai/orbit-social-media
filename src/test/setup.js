/**
 * Test Setup File
 * This file runs before each test file and sets up the testing environment
 */

// Import jest-dom matchers for DOM assertions
// This adds custom matchers like toBeInTheDocument(), toHaveClass(), etc.
import "@testing-library/jest-dom";

// Clean up after each test
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Mock localStorage that properly delegates to Storage.prototype
// This allows tests to spy on Storage.prototype methods
let localStorageStore = {};

// Store original Storage.prototype methods
const _originalStorageGetItem = Storage.prototype.getItem;
const _originalStorageSetItem = Storage.prototype.setItem;
const _originalStorageRemoveItem = Storage.prototype.removeItem;

// Override Storage.prototype methods to use our store
Storage.prototype.getItem = function (key) {
  return localStorageStore[key] ?? null;
};

Storage.prototype.setItem = function (key, value) {
  localStorageStore[key] = String(value);
};

Storage.prototype.removeItem = function (key) {
  delete localStorageStore[key];
};

// Create localStorage mock that calls through Storage.prototype
const localStorageMock = {
  getItem(key) {
    return Storage.prototype.getItem.call(this, key);
  },
  setItem(key, value) {
    return Storage.prototype.setItem.call(this, key, value);
  },
  removeItem(key) {
    return Storage.prototype.removeItem.call(this, key);
  },
  clear() {
    localStorageStore = {};
  },
  get length() {
    return Object.keys(localStorageStore).length;
  },
  key(index) {
    return Object.keys(localStorageStore)[index] ?? null;
  },
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Reset localStorage before each test
beforeEach(() => {
  localStorageStore = {};
});

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver for components that use it
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
});
