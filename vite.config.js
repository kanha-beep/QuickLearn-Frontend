import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        // The MongoDB backend lives in ../server and uses the primary API port.
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
