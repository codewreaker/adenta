import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

console.log(__dirname, 'dir');
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/website',
  resolve: {
    alias: {
      ['msw/native']: require.resolve(path.resolve('./node_modules/msw/lib/native/index.mjs')),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react(),nodePolyfills(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    emptyOutDir: true,
    transformMixedEsModules: true,
    outDir: '../../dist/packages/website',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/website',
      provider: 'v8' as const,
    },
  },
  assetsInclude: ['**/*.node'],
}));
