//@ts-check
const {globSync} = require('glob')

const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('node:path');


const globFiles = globSync([
  "**/*.{js,ts,tsx}"
],{
  cwd: path.resolve(__dirname, './'),
});

const entries = globFiles.reduce((acc, filePath, idx) => {
  const entryName = path.resolve(__dirname, filePath).replace(/\.[jt]sx?$/, "");
  acc[entryName] = path.resolve(__dirname, filePath);
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
      ...config.output,
      filename: "[name].js",
      libraryTarget: "module",
      chunkFormat: "module",
    },
    experiments: {
      ...config.experiments,
      outputModule: true,
    },
    module:{
      ...config.module,
      rules:[
        ...config.module.rules,
        {
          test: /\.node$/, // Exclude .node files
          use: "ignore-loader",
        }
      ]
    },
    resolve: {
      ...config.resolve,
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
    optimization: {
      minimize: false, // Keep individual files readable
    },
  };
});
