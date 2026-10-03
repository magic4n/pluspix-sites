import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // When deployed to GitHub Pages under /pluspix/, set base accordingly.
  // Locally (npm run dev) it defaults to '/'.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
