'use strict'

const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')

const { hasCoverage, uploadCoverage, checkCoverage } = require()

const unit = async function() {
  const shouldCoverage = await hasCoverage()

  if (!shouldCoverage) {
    return gulpExeca('ava')
  }

  await gulpExeca('nyc ava')

  await uploadCoverage()
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// We have to use this to debug Ava test files with Chrome devtools
const unitwatch = getWatchTask({ CHECK: unit }, unit)

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Check all source files are covered by tests'

module.exports = {
  unit,
  unitwatch,
  coverage,
}
