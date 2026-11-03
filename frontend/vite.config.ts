import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',
    port: 5174, // Corremos en 5174 para no colisionar con nada
    proxy: {
      '/api': {
        target: 'http://localhost:5060',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
