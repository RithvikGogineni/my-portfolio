import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Matched by module path, not package name: the string form only
        // matches a package's exact entry point, so deep imports such as
        // `react-dom/client` leaked into the app chunk and invalidated ~90kB
        // of otherwise-cacheable vendor code on every deploy.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return 'react-vendor'
          }
          if (/node_modules\/(framer-motion|motion-dom|motion-utils|gsap)\//.test(id)) {
            return 'animation-vendor'
          }
          if (/node_modules\/(@firebase|firebase|idb)\//.test(id)) {
            return 'firebase-vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
  },
})
