import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,
  },
  resolve: {
    // https://github.com/vitejs/vite/issues/5010
    preserveSymlinks: true,
    // https://github.com/prisma/prisma/issues/12504
    alias: {
      '.prisma/client/index-browser':
        './node_modules/.prisma/client/index-browser.js',
    },
  },
  // https://github.com/vitejs/vite/issues/3409
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
