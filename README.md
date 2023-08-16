# @lmcd/gulp-svgo

[![Build](https://github.com/lachlanmcdonald/gulp-svgo/actions/workflows/build.yml/badge.svg?branch=main)][build-link] [![npm version](https://badge.fury.io/js/%40lmcd%2Fgulp-svgo.svg)][package-link] [![License](https://img.shields.io/badge/License-MIT-blue.svg)][license-link] 

**gulp-svgo** is a [SVGO]-wrapper for [Gulp].

## Installation

To use **gulp-svgo**, you must install both **gulp-svgo** itself and the [**svgo** package][svgo-npm].

```sh
npm install --save-dev @lmcd/gulp-svgo svgo
```

## Usage

**gulp-svgo** exports factory method with the following signature:

```js
(svgo: svgo, options?: Record<string, any>)
```

Where:

- `svgo` must be the [**svgo** package][svgo-npm].
- `options` can be any key-value pairs, but as these are passed directly to SVGO's `optimize` function, should correspond with SVGO's configuration options.

## Implementation notes

- This plugin does not support Gulp versions earlier than Gulp 4.
- This plugin does not automatically load `svgo.config.js`.
- Passing a character-encodings other than UTF-8 is not explicitly disallowed, but the results are indeterminate.

## License

This repository is licensed under the [MIT license][license-link].

[svgo]: https://github.com/svg/svgo
[svgo-npm]: https://www.npmjs.com/package/svgo
[Gulp]: https://gulpjs.com/
[license-link]: https://github.com/lachlanmcdonald/gulp-svgo/blob/main/LICENSE
[build-link]: https://github.com/lachlanmcdonald/gulp-svgo/actions
[package-link]: https://www.npmjs.com/package/@lmcd/gulp-svgo
