/* eslint-disable import/no-commonjs, import/unambiguous, strict, import/no-unused-modules */
'use strict'

const babelConfig = require('./.babelrc.js')

// Meant to be used when caller adds custom Gulp tasks that needs to be
// compiled with Babel. This should be called directly, not as a Gulp task,
// and before requiring the custom Gulp tasks.
// This is used by this module itself (in the `gulpfile`), i.e. must use
// CommonJS.
const buildRegister = function() {
  // eslint-disable-next-line global-require
  require('@babel/register')({ ...babelConfig, babelrc: false })
}

module.exports = {
  buildRegister,
}
// eslint-disable-next-line max-len
/* eslint-enable import/no-commonjs, import/unambiguous, strict, import/no-unused-modules */
