//@ts-check
const {globSync} = require('glob')

const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('node:path');

const globFiles = globSync([
  "**/*.{js,ts,tsx}"
],{
  cwd: path.resolve(__dirname, './'),
});

const entries = globFiles.reduce((acc, filePath) => {
  const entryName = path.relative("packages/ui/", filePath).replace(/\.[jt]sx?$/, "");
  acc[entryName] = `./${filePath}`;
  return acc;
}, {});

module.exports = composePlugins(withNx(), withReact(), (config) => {
  return {
    ...config,
    entry: {
      // Point to each component directory, or use `index.ts` for main entry points
      ...entries
    },
    output: {
      ...config.output
    },
    experiments: {
      outputModule: true,
    },
    resolve: {
      ...config.resolve,
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
