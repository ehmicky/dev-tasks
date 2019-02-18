'use strict'

const { version } = require('process')
const { platform } = require('os')

const isCi = require('is-ci')
const fastGlob = require('fast-glob')

const { getWatchTask } = require('../utils')
const gulpExeca = require('../exec')
const { BUILD } = require('../files')

const unit = async function() {
  if (!(await runCoverage())) {
    return gulpExeca('ava')
  }

  const os = PLATFORMS[platform()]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replace(/\./gu, '_')}`
  await gulpExeca(
    `nyc ava && \
      curl -s https://codecov.io/bash > codecov && \
      bash codecov -f coverage/coverage-final.json -F ${os} -F ${nodeVersion} -Z && \
      rm codecov`,
  )
}

// Only run test coverage on CI because it's slow.
// Also do not run it on repositories without source code, e.g. with only
// configuration or text files.
const runCoverage = async function() {
  if (!isCi) {
    return false
  }

  const files = await fastGlob(`${BUILD}/**.js`)
  return files.length !== 0
}

const PLATFORMS = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows',
}

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// We have to use this to debug Ava test files with Chrome devtools
const unitwatch = getWatchTask({ CHECK: unit }, unit)

// eslint-disable-next-line fp/no-mutation
unitwatch.description = 'Run unit tests in watch mode'

module.exports = {
  unit,
  unitwatch,
}
