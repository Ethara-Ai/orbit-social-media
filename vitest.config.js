import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment for React component testing
    environment: 'jsdom',

    // Global test APIs (describe, it, expect, etc.)
    globals: true,

    // Setup files to run before each test file
    setupFiles: ['./src/test/setup.js'],

    // Test file patterns
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],

    // Exclude patterns
    exclude: ['node_modules', 'dist'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.{js,jsx,ts,tsx}',
        'src/main.jsx',
      ],
    },

    // Reporter options
    reporters: ['verbose'],

    // Watch mode exclude
    watchExclude: ['node_modules', 'dist'],
  },
});
