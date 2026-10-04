import { defineConfig, mergeConfig } from 'vite';
import base from './vite.config';
// Test server for automated screenshots: no HMR, no file watching (stable pages while files change).
export default mergeConfig(base, defineConfig({ server: { hmr: false, watch: { ignored: ['**/*'] }, port: 5191, strictPort: true } }));
