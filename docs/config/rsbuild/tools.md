

# tools

Options for low-level tools.

## tools.bundlerChain&#x20;

[rspack-chain](https://github.com/rspack-contrib/rspack-chain) is a utility library for configuring Rspack. By using `rspack-chain`, you can more easily modify and extend Rspack configurations.

{/* ## tools.cssExtract <RsbuildDocBadge path="/config/tools/css-extract" text="tools.cssExtract" /> */}

{/* Rsbuild uses the CssExtractRspackPlugin plugin by default to extract CSS into separate files. */}

## tools.cssLoader&#x20;

Rsbuild uses [css-loader](https://github.com/webpack-contrib/css-loader) by default to handle CSS resources. You can modify the options of css-loader through `tools.cssLoader`.

{/* ## tools.htmlPlugin <RsbuildDocBadge path="/config/tools/html-plugin" text="tools.htmlPlugin" /> */}

{/* The configs of [html-rspack-plugin](https://github.com/rspack-contrib/html-rspack-plugin) can be modified through `tools.htmlPlugin`. */}

## tools.lightningcssLoader&#x20;

You can set the options for [builtin:lightningcss-loader](https://rspack.rs/guide/features/builtin-lightningcss-loader) through `tools.lightningcssLoader`.

## tools.postcss&#x20;

Rsbuild integrates PostCSS by default, you can configure [postcss-loader](https://github.com/webpack-contrib/postcss-loader) through `tools.postcss`.

## tools.rspack&#x20;

`tools.rspack` is used to configure [Rspack](https://rspack.rs/config/index).

## tools.styleLoader&#x20;

The config of [style-loader](https://github.com/webpack-contrib/style-loader) can be set through `tools.styleLoader`.

## tools.swc&#x20;

You can set the options of [builtin:swc-loader](https://rspack.rs/guide/features/builtin-swc-loader) through `tools.swc`.
