import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react({ include: '**/*.js' })],
  server: {
    watch: {
      usePolling: true,
    },
    port: 3000,
  },
})
