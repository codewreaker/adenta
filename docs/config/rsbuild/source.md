

# source

Options for input source code.

## source.assetsInclude&#x20;

Include additional files that should be treated as static assets.

## source.decorators&#x20;

Used to configure the decorators syntax.

If [experimentalDecorators](https://www.typescriptlang.org/tsconfig/#experimentalDecorators) is enabled in `tsconfig.json`, Rslib will set `source.decorators.version` to `legacy` by default.

## source.define&#x20;

Replaces variables in your code with other values or expressions at compile time. This can be useful for injecting env variables and other information to the code during build time.

## source.entry&#x20;

Used to set the entry modules for building.

In Rslib, the default value is:

* bundle mode:

```ts
const defaultEntry = {
  // default support for other suffixes such as ts, tsx, jsx, mjs, cjs
  index: 'src/index.js',
};
```

* bundleless mode:

```ts
const defaultEntry = {
  index: 'src/**',
};
```

:::info
Check out the [lib.bundle](/config/lib/bundle.md#set-entry) to learn more about how to set entry for bundle and bundleless project.
:::

## source.exclude&#x20;

Exclude JavaScript or TypeScript files that do not need to be transformed by [SWC](https://rsbuild.rs/guide/configuration/swc).

::: note

Files configured in `source.exclude` will not be transformed by SWC, but the referenced files will still be bundled into the outputs.

If you want certain files not to be bundled into the outputs, you can use the following methods:

* **bundle mode**: Use Rspack's [IgnorePlugin](https://rspack.rs/plugins/webpack/ignore-plugin).
* **bundleless mode**: Use `source.entry` to configure the corresponding glob expression, refer to [Set entry](/config/lib/bundle.md#bundle-false).

:::

## source.include&#x20;

Specify additional JavaScript files that need to be compiled.

{/* ## source.preEntry <RsbuildDocBadge path="/config/source/pre-entry" text="source.preEntry" /> */}

{/* Add a script before the entry file of each page. This script will be executed before the page code. It can be used to execute global logics, such as injecting polyfills, setting global styles, etc. */}

## source.transformImport&#x20;

Transform the import path, which can be used to modularly import the subpath of third-party packages. The functionality is similar to [babel-plugin-import](https://npmjs.com/package/babel-plugin-import).

## source.tsconfigPath&#x20;

Configure a custom `tsconfig.json` file path to use, can be a relative or absolute path.

The `tsconfig.json` configuration file affects the following behavior of Rslib:

* The `paths` field is used to configure [Path alias](/config/rsbuild/resolve.md#resolvealias).
* The `experimentalDecorators` field is used to configure [Decorators version](/config/rsbuild/source.md#sourcedecorators).
* Used to configure the effective scope, rules, and output directory during [TypeScript declaration file generation](/config/lib/dts.md).
