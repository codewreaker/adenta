//@ts-check
const { composePlugins, withNx, withReact } = require('@nx/rspack');
const path = require('node:path');

module.exports = composePlugins(withNx(), withReact(), (config) => {
  return  {
    ...config,
    output: {
      ...config.output,
      filename: (pathData) => {
        // Get the chunk name
        const chunk = pathData.chunk;
        // Get the relative path from src to the file
        const relativePath = path.relative(
          path.resolve(__dirname, 'src'),
          chunk.entryModule.resource
        );
        // Replace the extension with .js
        return relativePath.replace(/\.[^/.]+$/, '.js');
      }
    },
    resolve:{
      ...config.resolve,
      alias:{
        "@": path.resolve(__dirname, "./src")
      }
    }
  };
});
