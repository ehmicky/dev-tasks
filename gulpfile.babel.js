// eslint-disable-next-line filenames/match-regex
'use strict'

module.exports = {
  // We do not use `dist` folder to avoid hard-to-debug problems due to
  // recursion
  ...require('./src'),
  ...require('./gulp'),
}
