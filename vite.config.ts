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
    // Enable tree-shaking optimization
    minify: 'esbuild',
    // Ensure proper asset handling for GitHub Pages
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate MUI into its own chunk for better caching
          'mui-core': ['@mui/material', '@mui/system'],
          'mui-icons': ['@mui/icons-material'],
          // Separate vendor libraries
          'vendor': ['react', 'react-dom', 'nanostores', '@nanostores/react'],
          // Separate YAML processing
          'yaml': ['js-yaml'],
        },
      },
    },
  },
  // Enable tree-shaking for dependencies
  optimizeDeps: {
    include: ['@mui/material', '@mui/system', '@mui/icons-material'],
  },
  // Handle YAML files and other assets
  assetsInclude: ['**/*.yml', '**/*.yaml'],
})
