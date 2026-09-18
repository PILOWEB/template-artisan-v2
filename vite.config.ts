import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Three.js et react-three-fiber dans un paquet à part, chargé uniquement par le
        // hero desktop. React et le routeur restent dans "vendor" : la page mobile ne
        // télécharge jamais le paquet 3D.
        codeSplitting: {
          groups: [
            { name: 'vendor', test: /node_modules[\\/](react|react-dom|scheduler|react-router|use-sync-external-store)[\\/]/, priority: 20 },
            { name: 'motion', test: /node_modules[\\/](gsap|lenis)[\\/]/, priority: 15 },
            { name: 'three', test: /node_modules[\\/](three|@react-three|react-reconciler|its-fine|suspend-react|zustand|react-use-measure)[\\/]/, priority: 10 },
          ],
        },
      },
    },
  },
});
