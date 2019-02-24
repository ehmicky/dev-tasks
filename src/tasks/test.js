'use strict'

const { series } = require('gulp')

const { check } = require('./check')
const { build } = require('./build')
const { unit } = require('./unit')

const testTask = series(build, check, unit)

// eslint-disable-next-line fp/no-mutation
testTask.description = 'Build, lint and test source files'

module.exports = {
  test: testTask,
}
