# adenta
A monorepo for a list of libraries I will use for my personal projects


```ts
{
  devServer: {
    port: 4200,
    hot: true,
    devMiddleware: {
      stats: true,
    },
  },
  target: "web",
  mode: "production",
  entry: {
    main: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/packages/ui/src/index.ts",
  },
  context: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/packages/ui",
  devtool: false,
  output: {
    path: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/dist/packages/ui",
    publicPath: "/",
    filename: "[name].[contenthash:8].js",
    chunkFilename: "[name].[contenthash:8].js",
    cssFilename: "[name].[contenthash:8].css",
    cssChunkFilename: "[name].[contenthash:8].css",
    assetModuleFilename: "[name].[contenthash:8][ext]",
  },
  module: {
    rules: [
      {
        test: {
        },
        loader: "builtin:swc-loader",
        exclude: {
        },
        options: {
          jsc: {
            parser: {
              syntax: "ecmascript",
            },
            externalHelpers: true,
          },
        },
        type: "javascript/auto",
      },
      {
        test: {
        },
        loader: "builtin:swc-loader",
        exclude: {
        },
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              decorators: true,
            },
            transform: {
              legacyDecorator: true,
              decoratorMetadata: true,
            },
            externalHelpers: true,
          },
        },
        type: "javascript/auto",
      },
      {
        test: {
        },
        type: "css/module",
      },
      {
        test: {
        },
        type: "css",
        use: [
          {
            loader: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/node_modules/.pnpm/postcss-loader@8.1.1_@rspack+core@1.0.5_@swc+helpers@0.5.13__postcss@8.4.47_typescript@5.5.4__mx7rpv6734x4pamou23smhltfe/node_modules/postcss-loader/dist/cjs.js",
          },
        ],
      },
      {
        test: {
        },
        type: "css/module",
        use: [
          {
            loader: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/node_modules/.pnpm/sass-loader@12.6.0_sass@1.80.4_webpack@5.95.0_@swc+core@1.5.29_@swc+helpers@0.5.13__esbuild@0.23.1_/node_modules/sass-loader/dist/cjs.js",
            options: {
              sourceMap: false,
              sassOptions: {
                fiber: false,
                precision: 8,
                includePaths: [
                ],
              },
            },
          },
        ],
      },
      {
        test: {
        },
        type: "css/module",
        use: [
          {
            loader: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/node_modules/.pnpm/less-loader@11.1.0_less@4.1.3_webpack@5.95.0_@swc+core@1.5.29_@swc+helpers@0.5.13__esbuild@0.23.1_/node_modules/less-loader/dist/cjs.js",
            options: {
              sourceMap: false,
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: {
        },
        use: [
          {
            loader: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/node_modules/.pnpm/stylus-loader@7.1.3_stylus@0.59.0_webpack@5.95.0_@swc+core@1.5.29_@swc+helpers@0.5.13__esbuild@0.23.1_/node_modules/stylus-loader/dist/cjs.js",
            options: {
              sourceMap: false,
              stylusOptions: {
                include: [
                ],
              },
            },
          },
        ],
      },
      {
        test: {
        },
        loader: "builtin:swc-loader",
        exclude: {
        },
        options: {
          jsc: {
            parser: {
              syntax: "ecmascript",
              jsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: false,
                refresh: false,
              },
            },
            externalHelpers: true,
          },
        },
        type: "javascript/auto",
      },
      {
        test: {
        },
        loader: "builtin:swc-loader",
        exclude: {
        },
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: false,
                refresh: false,
              },
            },
            externalHelpers: true,
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    {
      pluginOptions: {
        stats: {
          warnings: false,
          errors: false,
        },
        outputFilename: "3rdpartylicenses.txt",
        excludedPackageTest: (packageName) => {
          if (!rootPackageJsonName) {
              return false;
          }
          return packageName === rootPackageJsonName;
        },
      },
    },
    {
      name: "CopyRspackPlugin",
      affectedHooks: undefined,
      _args: [
        {
          patterns: [
          ],
        },
      ],
    },
    {
      name: "ProgressPlugin",
      affectedHooks: undefined,
      _args: [
      ],
    },
    {
      name: "HtmlRspackPlugin",
      affectedHooks: undefined,
      _args: [
        {
          template: "/Users/israelagyeman-prempeh/Dev-Ops/adenta/packages/ui/src/index.html",
        },
      ],
    },
    {
      keys: [
        "NODE_ENV",
      ],
      defaultValues: {
        NODE_ENV: "production",
      },
    },
  ],
  resolve: {
    alias: {
      "@/*": "/Users/israelagyeman-prempeh/Dev-Ops/adenta/src/*",
    },
    extensions: [
      "...",
      ".ts",
      ".tsx",
      ".jsx",
    ],
  },
  infrastructureLogging: {
    debug: false,
  },
  externals: {
  },
  externalsType: undefined,
  stats: {
    colors: true,
    preset: "normal",
  },
  experiments: {
    css: true,
  },
}
```