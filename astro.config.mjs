import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://wblandcalculator.com',
  output: 'static',
  integrations: [
    tailwind(),
    react()
  ],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
          }
        }
      }
    }
  }
});
