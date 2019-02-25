'use strict'

const {
  version,
  env: { TRAVIS_REPO_SLUG, TRAVIS_COMMIT },
} = require('process')
const { platform } = require('os')

const isCi = require('is-ci')
const fastGlob = require('fast-glob')
const fetch = require('cross-fetch')
const PluginError = require('plugin-error')

const { exec } = require('../exec')
const { JAVASCRIPT_SRC } = require('../files')

// Run in Bash, i.e. should use slashes even on Windows
const COVERAGE_PATH = 'coverage/coverage-final.json'

// Only run test coverage on CI because it's slow.
// Also do not run it on repositories without source code, e.g. with only
// configuration or text files.
const hasCoverage = async function() {
  if (!isCi) {
    return false
  }

  const files = await fastGlob(JAVASCRIPT_SRC)
  return files.length !== 0
}

// Upload test coverage to codecov
const uploadCoverage = async function() {
  const tags = getCoverageTags()

  const { body } = await fetch(CODECOV_SCRIPT)
  await exec(`bash -s -f ${COVERAGE_PATH} ${tags} -Z`, { input: body })
}

const CODECOV_SCRIPT = 'https://codecov.io/bash'

// Tag test coverage with OS and Node.js version
const getCoverageTags = function() {
  const os = PLATFORMS[platform()]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replace(/\./gu, '_')}`
  return [os, nodeVersion].map(getCoverageTag).join(' ')
}

const PLATFORMS = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows',
}

const getCoverageTag = function(tag) {
  return `-F ${tag}`
}

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
const checkCoverage = async function() {
  const shouldCover = await hasCoverage()

  if (!shouldCover) {
    return
  }

  const covInfo = await getCoverage()

  if (covInfo >= COVERAGE_THRESHOLD) {
    return
  }

  throw new PluginError(
    'gulp-codecov-check',
    `Test coverage is ${covInfo}% but should be at least ${COVERAGE_THRESHOLD}%`,
  )
}

const getCoverage = async function() {
  const codecovUrl = `https://codecov.io/api/gh/${TRAVIS_REPO_SLUG}/commit/${TRAVIS_COMMIT}`
  const response = await fetch(codecovUrl)
  const {
    commit: {
      // eslint-disable-next-line id-length
      totals: { c: covInfo },
    },
  } = await response.json()

  const covInfoA = Number(covInfo)
  return covInfoA
}

const COVERAGE_THRESHOLD = 100

module.exports = {
  hasCoverage,
  uploadCoverage,
  checkCoverage,
}
