import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Base path - use '/' for S3 root deployment
  // Change this if deploying to a subdirectory
  base: "/",

  // Build configuration
  build: {
    // Output directory
    outDir: "dist",

    // Generate sourcemaps for debugging (set to false for smaller builds)
    sourcemap: false,

    // Minify output
    minify: "terser",

    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ["react", "react-dom"],
          animations: ["framer-motion"],
        },
        // Asset file naming with hash for cache busting
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },

    // Increase chunk size warning limit (optional)
    chunkSizeWarningLimit: 500,
  },

  // Development server configuration
  server: {
    port: 5173,
    open: true,
    cors: true,
  },

  // Preview server configuration (for testing production builds locally)
  preview: {
    port: 4173,
    open: true,
  },

  // Resolve aliases (optional, for cleaner imports)
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@data": "/src/data",
      "@context": "/src/context",
      "@assets": "/src/assets",
    },
  },
});
