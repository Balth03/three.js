import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: './',
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: {
    target: 'es2022', outDir: 'dist', chunkSizeWarningLimit: 5000,
    // Split heavy, rarely-changing parts so a content update doesn't re-download the 3D engine.
    rollupOptions: { output: { manualChunks: (id) => (id.includes('node_modules/three') ? 'three' : id.includes('/data/') ? 'content' : id.includes('node_modules') ? 'vendor' : undefined) } },
  },
});
