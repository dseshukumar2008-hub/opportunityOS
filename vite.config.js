import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      // Matches the jsconfig.json '@/*' path mapping so IDE and bundler agree
      '@': resolve(__dirname, './src'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'https://opportunityos-backend-frlw.onrender.com',
        changeOrigin: true,
      }
    }
  },

  build: {
    // Disable source maps in production to avoid exposing source code
    sourcemap: false,

    // Increase the chunk-size warning threshold slightly; the large chunks
    // (firebase, pdf, jspdf, pdfjs) are already lazy-loaded by the app.
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split the largest vendor groups into named chunks for better caching.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          if (id.includes('node_modules/recharts')) {
            return 'vendor-recharts';
          }
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
  },
})

