# Glossary

## ESM

ESM stands for [ECMAScript modules](https://nodejs.org/api/esm.html#modules-ecmascript-modules), which is a modern module system introduced in ES2015 that allows JavaScript code to be organized into reusable, self-contained modules. ESM is now the standard for both [browser](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [Node.js](https://nodejs.org/api/esm.html) environments, replacing older module systems like [CommonJS (CJS)](https://nodejs.org/api/modules.html) and [AMD](https://requirejs.org/docs/whyamd.html).

## CJS

CJS stands for [CommonJS modules](https://nodejs.org/api/modules.html#modules-commonjs-modules), which is a module system used in JavaScript, particularly in server-side environments like Node.js. It was created to allow JavaScript to be used outside of the browser by providing a way to manage modules and dependencies.

## UMD

UMD stands for [Universal Module Definition](https://github.com/umdjs/umd), a pattern for writing JavaScript modules that can work universally across different environments, such as both the browser and Node.js. Its primary goal is to ensure compatibility with the most popular module systems, including AMD (Asynchronous Module Definition), CommonJS (CJS), and browser globals.

## Bundleless

Bundleless means that each source file is compiled and built separately, but not bundled together. Each output file can be found with its corresponding source code file. The process of bundleless build can also be understood as the process of code transformation of source files only.

## Module Federation

Module Federation is an architectural pattern for JavaScript application decomposition (similar to microservices on the server-side), allowing you to share code and resources between multiple JavaScript applications (or micro-frontends).

See [Module Federation](https://rsbuild.rs/guide/advanced/module-federation) for more details.

## More

See more glossary in [Rsbuild - Glossary](https://rsbuild.rs/guide/start/glossary) and [Rspack - Glossary](https://rspack.rs/misc/glossary).
