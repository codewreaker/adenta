import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/ui',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', 'src/**/*.html']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../coverage/ui',
      provider: 'v8' as const,
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: './src/index.ts',
        sandbox: './src/lib/LiveEditor/sandbox.html',
      },
    },
  },
}));
