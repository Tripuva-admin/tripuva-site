import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext"  // Allows top-level await
  },
  esbuild:{
    target: "esnext"
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
    esbuildOptions: {
      target: "esnext"
    }
  },
});
