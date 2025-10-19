import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
    // Disable minification for faster builds (optional)
    // minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          stream: ['stream-chat', 'stream-chat-react', '@stream-io/video-react-sdk']
        }
      }
    }
  }
})