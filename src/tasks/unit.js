'use strict'

const { platform } = require('process')

const { exec } = require('../exec')

const { hasCoverage, uploadCoverage, checkCoverage } = require('./coverage')

const unit = async function() {
  const flags = getAvaFlags()

  const shouldCover = await hasCoverage()

  if (!shouldCover) {
    return exec('ava', flags)
  }

  await exec('nyc', [
    '--reporter=lcov',
    '--reporter=text',
    '--reporter=html',
    '--reporter=json',
    'ava',
    ...flags,
  ])

  await uploadCoverage()
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
const unitw = () => exec('ava', ['-w', ...getAvaFlags()])

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

// Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
const getAvaFlags = function() {
  if (platform !== 'win32') {
    return []
  }

  return ['--serial']
}

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Check all source files are covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
