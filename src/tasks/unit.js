'use strict'

const { platform } = require('process')

const gulpExeca = require('../exec')

const { hasCoverage, uploadCoverage, checkCoverage } = require('./coverage')

const unit = async function() {
  const flags = getAvaFlags()

  const shouldCover = await hasCoverage()

  if (!shouldCover) {
    return gulpExeca(`ava ${flags}`)
  }

  await gulpExeca(
    `nyc --reporter=lcov --reporter=text --reporter=html --reporter=json ava ${flags}`,
  )

  await uploadCoverage()
}

// Ava watch mode is better than using `gulp.watch()`
const unitw = async function() {
  const flags = getAvaFlags()
  await gulpExeca(`ava -w ${flags}`)
}

// Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
const getAvaFlags = function() {
  if (platform !== 'win32') {
    return ''
  }

  return '--serial'
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Check all source files are covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
