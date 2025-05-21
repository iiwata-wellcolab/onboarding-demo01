import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/onboarding-demo01/',  // GitHub Pagesのリポジトリ名を指定
  server: {
    host: '0.0.0.0',
  }
})
