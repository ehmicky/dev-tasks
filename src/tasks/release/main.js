'use strict'

const { series } = require('gulp')
const releaseIt = require('release-it')

const { test } = require('../test')

const { checkVersions } = require('./version')

const releaseItTask = async function(increment) {
  await releaseIt({ ...RELEASE_IT_CONFIG, increment })
}

const RELEASE_IT_CONFIG = {
  'non-interactive': true,
  'disable-metrics': true,
  // eslint-disable-next-line unicorn/prevent-abbreviations
  pkgFiles: ['package.json', 'package-lock.json'],
  github: {
    release: true,
  },
  npm: {
    publish: false,
  },
}

const prereleaseTasks = [checkVersions, test]

// Cannot use `func.bind()` otherwise task name will be prepended with `bound `
const releaseItMajor = () => releaseItTask('major')
const releaseMajor = series(...prereleaseTasks, releaseItMajor)

// eslint-disable-next-line fp/no-mutation
releaseMajor.description = 'Release a new major version x.*.*'

const releaseItMinor = () => releaseItTask('minor')
const releaseMinor = series(...prereleaseTasks, releaseItMinor)

// eslint-disable-next-line fp/no-mutation
releaseMinor.description = 'Release a new minor version *.x.*'

const releaseItPatch = () => releaseItTask('patch')
const releasePatch = series(...prereleaseTasks, releaseItPatch)

// eslint-disable-next-line fp/no-mutation
releasePatch.description = 'Release a new patch version *.*.x'

module.exports = {
  releaseMajor,
  releaseMinor,
  releasePatch,
}
