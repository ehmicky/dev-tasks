import { version, env, platform } from 'process'

import isCi from 'is-ci'
import got from 'got'
import PluginError from 'plugin-error'
import { exec } from 'gulp-execa'

const NYCRC_CONFIG = `${__dirname}/.nycrc.json`
// Run in Bash, i.e. should use slashes even on Windows
const CODECOV_SCRIPT = `${__dirname}/codecov.sh`
const COVERAGE_PATH = 'coverage/coverage-final.json'

const {
  TRAVIS_REPO_SLUG,
  TRAVIS_COMMIT,
  TRAVIS_PULL_REQUEST_SHA,
  COVERAGE,
} = env

// Wrap with `nyc` if in CI
// Locally, one must directly call `nyc ava`
export const getNyc = function () {
  if (!shouldCover()) {
    return ''
  }

  return `nyc --nycrc-path=${NYCRC_CONFIG} `
}

// Upload test coverage to codecov
export const uploadCoverage = async function () {
  if (!shouldCover()) {
    return
  }

  const tags = getCoverageTags()
  await exec(`bash ${CODECOV_SCRIPT} -f ${COVERAGE_PATH} ${tags} -Z`)
}

// Tag test coverage with OS and Node.js version
const getCoverageTags = function () {
  const os = PLATFORMS[platform]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replace(/\./gu, '_')}`
  return [os, nodeVersion].map(getCoverageTag).join(' ')
}

const PLATFORMS = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows',
}

const getCoverageTag = function (tag) {
  return `-F ${tag}`
}

// Only run test coverage on CI because it's slow.
// Test coverage can also be opted out with the `COVERAGE=false` environment
// variable for example when there is no source code
// (e.g. `@ehmicky/eslint-config`).
const shouldCover = function () {
  return isCi && COVERAGE !== 'false'
}

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
export const checkCoverage = async function () {
  if (!shouldCover()) {
    return
  }

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

const getCoverage = async function () {
  const codecovUrl = getCodecovUrl()
  const {
    commit: { totals },
  } = await got(codecovUrl, {
    timeout: CODECOV_TIMEOUT,
    retry: CODECOV_RETRY,
  }).json()

  // This happens when codecov could not find the commit on GitHub
  if (totals === null) {
    throw new PluginError(
      'gulp-codecov-check',
      `Test coverage is missing. See ${codecovUrl}`,
    )
  }

  const covInfo = Number(totals.c)
  return covInfo
}

// Codecov API fails quite often, we must timeout and retry
const CODECOV_TIMEOUT = 6e4
const CODECOV_RETRY = 10

const getCodecovUrl = function () {
  const commit = TRAVIS_PULL_REQUEST_SHA || TRAVIS_COMMIT
  return `https://codecov.io/api/gh/${TRAVIS_REPO_SLUG}/commit/${commit}`
}

const COVERAGE_THRESHOLD = 100
