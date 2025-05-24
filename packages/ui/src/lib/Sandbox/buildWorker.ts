import {rspack} from '@rspack/core';
import type { Compiler } from '@rspack/core';
import { FileData } from './types';

interface BuildWorkerMessage {
  type: 'build-request';
  payload: {
    files: FileData[];
  };
}

// Create an in-memory filesystem
const memfs = new Map<string, string>();

// Configure rspack
const compiler = rspack({
  entry: './src/index.tsx',
  output: {
    path: '/dist',
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // Use in-memory filesystem
  infrastructureLogging: {
    level: 'none',
  },
  plugins: [
    // Plugin to write to memory instead of disk
    {
      apply(compiler: Compiler) {
        compiler.hooks.emit.tap('MemoryFsPlugin', (compilation) => {
          compilation.assets = Object.fromEntries(
            Object.entries(compilation.assets).map(([filename, source]) => {
              memfs.set(filename, source.source());
              return [filename, source];
            })
          );
        });
      },
    },
  ],
});

// Handle build requests
self.onmessage = (event: MessageEvent<BuildWorkerMessage>) => {
  const { type, payload } = event.data;

  if (type === 'build-request') {
    const { files } = payload;

    try {
      // Write files to memory
      files.forEach(file => {
        memfs.set(file.name, file.value);
      });

      // Run compilation
      compiler.run((err, stats) => {
        if (err) {
          self.postMessage({
            type: 'build-error',
            payload: { error: err.message },
          });
          return;
        }

        if (stats?.hasErrors()) {
          self.postMessage({
            type: 'build-error',
            payload: { error: stats.toString('errors-only') },
          });
          return;
        }

        // Get the bundle
        const bundle = memfs.get('/dist/bundle.js');
        if (!bundle) {
          throw new Error('Bundle not found');
        }

        // Send success with bundle
        self.postMessage({
          type: 'build-success',
          payload: { bundle },
        });
      });
    } catch (error) {
      self.postMessage({
        type: 'build-error',
        payload: { error: error instanceof Error ? error.message : 'Unknown error' },
      });
    }
  }
};
