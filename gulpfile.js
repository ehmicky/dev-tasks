'use strict'

// We do not use `build` directory nor 'gulpfile.babel.js` to avoid
// hard-to-debug problems due to recursion.
// eslint-disable-next-line import/order
const babelConfig = require('./src/tasks/build/.babelrc.js')

require('@babel/register')({ ...babelConfig, babelrc: false })

const tasks = require('./src/main.js')
const { download } = require('./gulp/download.js')

module.exports = {
  ...tasks,
  download,
}
