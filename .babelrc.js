'use strict'

// This file is loaded before `gulp build` by `@babel/register`, i.e. before any
// Babel compilation, so:
//   - it must be top-level, because it cannot require files in `build/` (since
//     they are not built yet). However it should not require `src/` since this
//     the file published and required by callers.
//   - it cannot use ES modules.
module.exports = function(conf) {
  conf.cache.forever()

  return {
    presets: [
      [
        '@babel/preset-env',
        { targets: { node: '8.10.0' }, useBuiltIns: 'usage', corejs: '3' },
      ],
    ],
    comments: false,
    shouldPrintComment: comment => comment.includes('istanbul ignore'),
    minified: true,
    retainLines: true,
  }
}
