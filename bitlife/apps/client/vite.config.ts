import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: './',
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: { target: 'es2022', outDir: 'dist', chunkSizeWarningLimit: 2000 },
});
