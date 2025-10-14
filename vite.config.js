import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ ensures routes work after build
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
})

