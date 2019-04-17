'use strict'

// Meant to be used by caller as `presets`.
// Only useful when caller needs to use `@babel/register`, e.g. when using
// `gulpfile.babel.js`.
// This cannot be a JSON file because that does not work with `presets`.
module.exports = require('./build/src/tasks/build/.babelrc.js')
