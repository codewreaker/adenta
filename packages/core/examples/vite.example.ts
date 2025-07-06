import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// This config is for the dev example client in packages/core/examples
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
}); 