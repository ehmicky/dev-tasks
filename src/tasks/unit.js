'use strict'

const { exec } = require('../exec')

const { hasCoverage, uploadCoverage, checkCoverage } = require('./coverage')

const unit = async function() {
  const shouldCover = await hasCoverage()

  if (!shouldCover) {
    return exec('ava')
  }

  await exec(
    'nyc --reporter=lcov --reporter=text --reporter=html --reporter=json --exclude=build/test --exclude=ava.config.js ava',
  )

  await uploadCoverage()
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
const unitw = () => exec('ava -w')

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
