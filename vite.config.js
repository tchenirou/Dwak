import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // vite.config.js
  optimizeDeps: {
    include: ['jwt-decode'],
  },
  plugins: [react()],
})
