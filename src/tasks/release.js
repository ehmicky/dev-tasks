'use strict'

const { series } = require('gulp')
const releaseIt = require('release-it')

const { test } = require('./test')

const releaseItTask = async function(increment) {
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

// Cannot use `func.bind()` otherwise task name will be prepended with `bound `
const releaseItMajor = () => releaseItTask('major')
const releaseMajor = series(test, releaseItMajor)

// eslint-disable-next-line fp/no-mutation
releaseMajor.description = 'Release a new major version x.*.*'

const releaseItMinor = () => releaseItTask('minor')
const releaseMinor = series(test, releaseItMinor)

// eslint-disable-next-line fp/no-mutation
releaseMinor.description = 'Release a new minor version *.x.*'

const releaseItPatch = () => releaseItTask('patch')
const releasePatch = series(test, releaseItPatch)

// eslint-disable-next-line fp/no-mutation
releasePatch.description = 'Release a new patch version *.*.x'

module.exports = {
  releaseMajor,
  releaseMinor,
  releasePatch,
}
