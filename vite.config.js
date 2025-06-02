import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Firebase Hosting用に変更
  server: {
    host: '0.0.0.0',
  }
})
