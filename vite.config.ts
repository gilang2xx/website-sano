import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => {
    return {
      build: {
        // Build SSR (entry-server.tsx -> dist-ssr) hanya butuh JS; jangan
        // salin ratusan MB aset public/ (video/gambar) ke dist-ssr.
        copyPublicDir: !isSsrBuild,
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
