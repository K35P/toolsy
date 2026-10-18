import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const host = process.env.TAURI_DEV_HOST || '127.0.0.1'

export default defineConfig({
  resolve: {
    alias: { '@': path.join(__dirname, 'src') },
  },
  plugins: [react()],
  clearScreen: false,
  server: {
    host,
    port: 1420,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
})
