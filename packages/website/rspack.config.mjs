import { composePlugins, withNx, withReact } from '@nx/rspack';
//import { tanstackRouter } from '@tanstack/router-plugin/rspack'

export default composePlugins(withNx(), withReact(), (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      // tanstackRouter({
      //   target: 'react',
      //   autoCodeSplitting: true,
      // })
    ],
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
