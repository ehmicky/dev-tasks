// eslint-disable-next-line filenames/match-regex
'use strict'

// We do not use `build` directory to avoid hard-to-debug problems due to
// recursion
const tasks = require('./src/main.js')
const { download } = require('./gulp/download.js')

module.exports = {
  ...tasks,
  download,
}
