import { composePlugins, withNx, withReact } from '@nx/rspack';

export default composePlugins(withNx(), withReact(), (config) => {
  return {
    ...config,
    output: {
      ...config.output,
      publicPath: '/',
    },
    devServer: {
      ...config.devServer,
      static: {
        directory: 'packages/website/public',
        publicPath: '/',
      }
    }
  }
});
