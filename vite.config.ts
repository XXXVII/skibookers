import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages specific configuration
  base: process.env.NODE_ENV === 'production' ? '/skibookers/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper asset handling for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Handle YAML files and other assets
  assetsInclude: ['**/*.yml', '**/*.yaml'],
})
