import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Build relative asset URLs so the app works from the GitHub Pages subpath.
  base: './',
  plugins: [react(), tailwindcss()],
});
