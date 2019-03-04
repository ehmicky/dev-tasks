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

// Only run test coverage on CI because it's slow.
// One can also use the `--cover` flag to trigger it locally.
// Also do not run it on repositories without source code, e.g. with only
// configuration or text files.
const shouldCover = async function(command) {
  if (!isCi && !command.includes(COVER_FLAG)) {
    return false
  }

  const files = await fastGlob(`${SRC}/**/*.js`)
  return files.length !== 0
}

const COVER_FLAG = '--cover'

// Upload test coverage to codecov
const uploadCoverage = async function() {
  if (!isCi) {
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

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
const checkCoverage = async function() {
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
  addCoverage,
  uploadCoverage,
  checkCoverage,
}
