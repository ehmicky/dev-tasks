const { series } = require('gulp')

const { check } = require('./check/main.js')
const { build } = require('./build/main.js')
const { unit } = require('./unit/main.js')

const testTask = series(check, build, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Build, lint and test source files'

module.exports = {
  testTask,
}
