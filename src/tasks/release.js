'use strict'

const { series } = require('gulp')
const releaseIt = require('release-it')

const { test } = require('./test')

const releaseItTask = increment => releaseIt({ ...config, increment })

const config = {
  'non-interactive': true,
  'disable-metrics': true,
  pkgFiles: ['package.json', 'package-lock.json'],
  github: {
    release: true,
  },
  npm: {
    publish: false,
  },
}

const releaseMajor = series(test, releaseItTask.bind(null, 'major'))

// eslint-disable-next-line fp/no-mutation
releaseMajor.description = 'Release a new major version x.*.*'

const releaseMinor = series(test, releaseItTask.bind(null, 'minor'))

// eslint-disable-next-line fp/no-mutation
releaseMinor.description = 'Release a new minor version *.x.*'

const releasePatch = series(test, releaseItTask.bind(null, 'patch'))

// eslint-disable-next-line fp/no-mutation
releasePatch.description = 'Release a new patch version *.*.x'

module.exports = {
  releaseMajor,
  releaseMinor,
  releasePatch,
}
