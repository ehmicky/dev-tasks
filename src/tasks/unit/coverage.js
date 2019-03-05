'use strict'

const {
  version,
  env: { TRAVIS_REPO_SLUG, TRAVIS_COMMIT, TRAVIS_PULL_REQUEST_SHA },
} = require('process')
const { platform } = require('os')

const isCi = require('is-ci')
const fastGlob = require('fast-glob')
const fetch = require('cross-fetch')
const PluginError = require('plugin-error')

const { exec } = require('../../exec')
const { SRC } = require('../../files')

// Run in Bash, i.e. should use slashes even on Windows
const CODECOV_SCRIPT = `${__dirname}/codecov.sh`
const COVERAGE_PATH = 'coverage/coverage-final.json'

// Wrap with `nyc` if in CI or `--cover` flag is used
const addCoverage = async function(command) {
  const shouldAddCoverage = await shouldCover(command)

  if (!shouldAddCoverage) {
    return command
  }

  const commandA = command.replace(COVER_FLAG, '')
  return `nyc --reporter=lcov --reporter=text --reporter=html --reporter=json --exclude=build/test --exclude=ava.config.js ${commandA}`
}

// Upload test coverage to codecov
const uploadCoverage = async function() {
  const shouldAddCoverage = await shouldCover()

  if (!shouldAddCoverage) {
    return
  }

  const tags = getCoverageTags()
  await exec(`bash ${CODECOV_SCRIPT} -f ${COVERAGE_PATH} ${tags} -Z`)
}

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

// Only run test coverage on CI because it's slow.
// One can also use the `--cover` flag to trigger it locally.
// Also do not run it on repositories without source code, e.g. with only
// configuration or text files.
const shouldCover = function(command = '') {
  return (isCi || command.includes(COVER_FLAG)) && hasCode()
}

const hasCode = async function() {
  const files = await fastGlob(`${SRC}/**/*.js`)
  return files.length !== 0
}

const COVER_FLAG = '--cover'

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
const checkCoverage = async function() {
  const covInfo = await getCoverage()

  if (covInfo >= COVERAGE_THRESHOLD) {
    return
  }

  const codecovUrl = getCodecovUrl().replace('/api', '')
  throw new PluginError(
    'gulp-codecov-check',
    `Test coverage is ${covInfo}% but should be at least ${COVERAGE_THRESHOLD}%. See ${codecovUrl}`,
  )
}

const getCoverage = async function() {
  const codecovUrl = getCodecovUrl()
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

const getCodecovUrl = function() {
  const commit = TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT
  return `https://codecov.io/api/gh/${TRAVIS_REPO_SLUG}/commit/${commit}`
}

const COVERAGE_THRESHOLD = 100

module.exports = {
  addCoverage,
  uploadCoverage,
  checkCoverage,
}
