'use strict'

// This file is loaded before `gulp build` by `@babel/register`, i.e. before any
// Babel compilation, so it cannot use ES modules.
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
