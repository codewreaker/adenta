# tsup

This section introduces how to migrate a project using tsup to Rslib.

## Installing dependencies

First, you need to replace the npm dependencies of tsup with Rslib's dependencies.



* Remove tsup:

- Install Rslib:

## Updating npm scripts

Next, you need to update the npm scripts in your package.json to use Rslib's CLI commands.

```diff title="package.json"
{
  "scripts": {
-   "build": "tsup",
-   "build:watch": "tsup --watch",
+   "build": "rslib build",
+   "build:watch": "rslib build --watch"
  }
}
```

## Create configuration file

Create a Rslib configuration file `rslib.config.ts` in the same directory as `package.json`, and add the following content:

```ts title="rslib.config.ts"
import { defineConfig } from '@rslib/core';

export default defineConfig({});
```

## Configuration migration

Here is the corresponding Rslib configuration for tsup configuration:

| tsup          | Rslib                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| banner        | [lib.banner](/config/lib/banner.md)                                                                           |
| bundle        | [lib.bundle](/config/lib/bundle.md)                                                                           |
| clean         | [output.cleanDistPath](/config/rsbuild/output.md#outputcleandistpath)                                         |
| define        | [source.define](/config/rsbuild/source.md#sourcedefine)                                                       |
| dts           | [lib.dts](/config/lib/dts.md)                                                                                 |
| entry         | [source.entry](/config/rsbuild/source.md#sourceentry)                                                         |
| external      | [output.externals](/config/rsbuild/output.md#outputexternals) / [lib.autoExternal](/config/lib/auto-external.md) |
| format        | [lib.format](/config/lib/format.md)                                                                           |
| footer        | [lib.footer](/config/lib/footer.md)                                                                           |
| minify        | [output.minify](/config/rsbuild/output.md#outputminify)                                                       |
| platform      | [output.target](/config/rsbuild/output.md#outputtarget)                                                       |
| plugins       | [plugins](/config/rsbuild/plugins.md)                                                                         |
| sourcemap     | [output.sourceMap](/config/rsbuild/output.md#outputsourcemap)                                                 |
| shims         | [lib.shims](/config/lib/shims.md)                                                                             |
| terserOptions | [output.minify](/config/rsbuild/output.md#outputminify)                                                       |
| tsconfig      | [source.tsconfigPath](/config/rsbuild/source.md#sourcetsconfigpath)                                           |

## Contents supplement

The current document only covers part of the migration process. If you find suitable content to add, feel free to contribute to the documentation via pull request 🤝.

> The documentation for Rslib can be found in the [rslib/website](https://github.com/web-infra-dev/rslib/tree/main/website) directory.
