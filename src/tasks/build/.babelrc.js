'use strict'

const { cwd } = require('process')
const { dependencies = {} } = require(`${cwd()}/package.json`)

// Using `core-js` as a dependency is optional
const presetEnvOptions =
  dependencies['core-js'] === undefined
    ? {}
    : { useBuiltIns: 'usage', corejs: '3' }

// This file is loaded before `gulp build` by `@babel/register`, i.e. before any
// Babel compilation, so it cannot use ES modules.
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: '10.17.0' }, ...presetEnvOptions },
    ],
  ],
  comments: false,
  shouldPrintComment: (comment) => comment.includes('istanbul ignore'),
  minified: true,
  retainLines: true,
}
