import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Game data (cities, cars, economy, missions) lives in /data at the repo root and is served as static files.
export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, '../../data'),
  server: { port: 5173, host: true, fs: { allow: [resolve(__dirname, '../..')] } },
  preview: { port: 4173, host: true },
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@dimforge/rapier3d-compat'] },
});
