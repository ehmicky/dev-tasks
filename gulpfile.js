'use strict'

// We do not use `build` directory nor 'gulpfile.babel.js` to avoid
// hard-to-debug problems due to recursion.
// Instead we call `@babel/register` and require the `src` directory.
// eslint-disable-next-line import/order
const { buildRegister } = require('./src/tasks/build/register.js')

buildRegister()

const tasks = require('./src/main.js')
const { download } = require('./gulp/download.js')

module.exports = {
  ...tasks,
  download,
}
