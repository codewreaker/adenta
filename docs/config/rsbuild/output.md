

# output

Options for build outputs.

## output.assetPrefix&#x20;

Use this option to set the URL prefix for static assets, such as setting it to a CDN URL.

In Rslib, the default value for this option depends on [format](/config/lib/format.md):

* When `format` is `cjs` or `esm`, the default value is `"auto"`.
* When `format` is `mf` or `umd`, the default value is `"/"`.

When `output.assetPrefix` is set to `"auto"`, Rslib defaults to setting [importMode](https://rspack.rs/config/module#modulegeneratorassetimportmode) to `"preserve"`, which preserves the `import` or `require` statements for static assets in JavaScript files. Additionally, the static asset references in CSS files remain as relative paths, see [Import static assets](/guide/advanced/static-assets.md) for more details.

When `output.assetPrefix` is set to a specific path, the static asset import statements in JavaScript files will no longer be preserved and will be replaced with URLs prefixed by that path. Additionally, the static asset paths in CSS files will be substituted with paths that include this prefix.

## output.charset&#x20;

The `charset` config allows you to specify the [character encoding](https://developer.mozilla.org/en-US/docs/Glossary/Character_encoding) for output files to ensure they are displayed correctly in different environments.

## output.cleanDistPath&#x20;

Whether to clean up all files under the output directory before the build starts (the output directory defaults to `dist`).

## output.copy&#x20;

Copies the specified file or directory to the dist directory, implemented based on [rspack.CopyRspackPlugin](https://rspack.rs/plugins/rspack/copy-rspack-plugin).

## output.cssModules&#x20;

For custom CSS Modules configuration.

## output.dataUriLimit&#x20;

Set the size threshold to inline static assets such as images and fonts.

When [format](/config/lib/format.md) is set to `cjs` or `esm`, Rslib defaults to setting `output.dataUriLimit` to `0`, without inlining any static assets, so that build tools on the application side can handle and optimize them.

## output.distPath&#x20;

Set the directory of the dist files. Rsbuild will output files to the corresponding subdirectory according to the file type.

By default, Rslib sets `output.distPath` to:

```ts
const defaultDistPath = {
  root: 'dist',
  js: './',
  jsAsync: './',
  css: './',
  cssAsync: './',
  svg: 'static/svg',
  font: 'static/font',
  wasm: 'static/wasm',
  image: 'static/image',
  media: 'static/media',
  assets: 'static/assets',
};
```

{/* ## output.emitAssets <RsbuildDocBadge path="/config/output/emit-assets" text="output.emitAssets" /> */}

{/* Control whether to emit static assets such as images, fonts, audio, video, etc. */}

## output.emitCss&#x20;

Whether to emit CSS to the output bundles.

## output.externals&#x20;

At build time, prevent some `import` dependencies from being packed into bundles in your code, and instead fetch them externally at runtime.

In bundle mode, Rslib will automatically add the dependencies listed in the `dependencies`, `optionalDependencies`, and `peerDependencies` fields of `package.json` to `output.externals`. See [lib.autoExternal](/config/lib/auto-external.md) for more information.

:::note
It is important to note that `output.externals` differs from [resolve.alias](/config/rsbuild/resolve.md#resolvealias). Check out [resolve.alias](/config/rsbuild/resolve.md#resolvealias) documentation for more information.
:::

## output.filenameHash&#x20;

Whether to add a hash value to the filename after the production build.

Rslib sets `output.filenameHash` to `false` by default.

::: info Filename hash

By default, Rslib does not add a hash value in the middle of filenames.

To enable this behavior, you can set `output.filenameHash` to `true`.

You can also specify different filenames for different types of files by configuring `output.filename`.

:::

## output.filename&#x20;

Sets the filename of dist files.

By default, Rslib will modify the JavaScript output file extension by setting `output.filename.js` according to [format](/config/lib/format.md), see [autoExtension](/config/lib/auto-extension.md) for more details.

## output.injectStyles&#x20;

Whether to inject styles into DOM.

## output.inlineScripts&#x20;

Whether to inline output scripts files (.js files) into HTML with `<script>` tags.

## output.inlineStyles&#x20;

Whether to inline output style files (.css files) into HTML with `<style>` tags.

## output.legalComments&#x20;

Configure how to handle the legal comment.

## output.manifest&#x20;

Whether to generate a manifest file that contains information of all assets, and the mapping relationship between [entry module](https://rsbuild.rs/config/source/entry) and assets.

## output.minify&#x20;

Configure whether to enable code minification, or to configure minimizer options.

When `output.minify` is not specified, Rslib will use a sane default value.

* When format is `esm` or `cjs`, only dead code elimination and unused code elimination will be performed. The default value is:

```ts
export default defineConfig({
  output: {
    minify: {
      js: true,
      css: false,
      jsOptions: {
        minimizerOptions: {
          mangle: false,
          minify: false,
          compress: {
            defaults: false,
            unused: true,
            dead_code: true,
            toplevel: true,
          },
          format: {
            comments: 'some',
            preserve_annotations: true,
          },
        },
      },
    },
  },
});
```

* When format is `umd`, the default value is the same as above, only dead code elimination and unused code elimination will be performed, which is usually used to generate UMD output for development. If you need to generate UMD output for production with the smallest possible bundle size, you can set `output.minify` to true:

```ts
export default defineConfig({
  output: {
    minify: true,
  },
});
```

* When format is `mf`, since MF assets are loaded over the network, which means they will not be compressed by the application project. Therefore, they need to be minified in Rslib. The default value is:

```ts
export default defineConfig({
  output: {
    minify: {
      js: true,
      css: false,
      jsOptions: {
        minimizerOptions: {
          mangle: false,
          // Enable minification
          minify: true,
          compress: {
            defaults: false,
            unused: true,
            dead_code: true,
            // Avoid remoteEntry's global variable being tree-shaken
            toplevel: false,
          },
          format: {
            comments: 'some',
            preserve_annotations: true,
          },
        },
      },
    },
  },
});
```

::: note

It should be noted that the `output.minify` option you configured will completely override the above default configuration.

:::

## output.overrideBrowserslist&#x20;

Specifies the range of target browsers that the project is compatible with.

Rslib will generate `output.overrideBrowserslist` based on [syntax](/config/lib/syntax.md), see [ESX\_TO\_BROWSERSLIST](https://github.com/web-infra-dev/rslib/blob/8d65f3728d60254bcf1a8e24d72902ad79dae959/packages/core/src/utils/syntax.ts#L42-L153) to get the mapping value.

## output.polyfill&#x20;

Through the `output.polyfill` option, you can control the injection mode of the polyfills.

:::warning
Rsbuild's `output.polyfill` injects polyfills into the global scope, which can unexpectedly modify global variables for library consumers. For a non-global polyfill solution for browsers, please refer to [Polyfill - Browser](/guide/advanced/output-compatibility.md#browser).
:::

## output.sourceMap&#x20;

Used to set whether to generate source map files, and which format of source map to generate.

## output.target&#x20;

Setting the build target of Rsbuild.

Rslib sets `output.target` to `node` by default.

:::info
Check out the [Solution](/guide/solution/index.md) to learn more about the build target.
:::
