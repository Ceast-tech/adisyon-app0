import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // '/api' ile başlayan tüm istekleri backend'e (port 3000) yönlendirir.
    // Bu sayede fetch('/api/...') CORS hatası vermeden çalışır.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
