import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['network-intrusion-detection-ipvy.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: true,
    allowedHosts: ['network-intrusion-detection-ipvy.onrender.com', '.onrender.com', 'localhost', '127.0.0.1'],
  },
})
