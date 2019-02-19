'use strict'

const { series } = require('gulp')

const { test } = require('./test')

const releaseItTask = async function(increment) {
  // Does not support Node <8
  // TODO: put top-level after dropping support for Node <8
  const releaseIt = require('release-it')

  await releaseIt({ ...config, increment })
}

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
