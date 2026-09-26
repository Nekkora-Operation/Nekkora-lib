import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: resolve(import.meta.dirname),
  base: './',
  plugins: [react()],
  resolve: {
    alias: { 'nekkora-lib': resolve(import.meta.dirname, '../src/index.ts') },
  },
});
