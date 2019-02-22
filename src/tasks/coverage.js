'use strict'

const {
  version,
  env: { TRAVIS_REPO_SLUG, TRAVIS_COMMIT },
} = require('process')
const { platform } = require('os')
const { writeFile, unlink } = require('fs')
const { promisify } = require('util')

const isCi = require('is-ci')
const fastGlob = require('fast-glob')
const fetch = require('cross-fetch')
const PluginError = require('plugin-error')

const execa = require('../exec')
const { BUILD } = require('../files')

const pWriteFile = promisify(writeFile)
const pUnlink = promisify(unlink)

// Only run test coverage on CI because it's slow.
// Also do not run it on repositories without source code, e.g. with only
// configuration or text files.
const hasCoverage = async function() {
  if (!isCi) {
    return false
  }

  const files = await fastGlob(`${BUILD}/**.js`)
  return files.length !== 0
}

// Upload test coverage to codecov
const uploadCoverage = async function() {
  const tags = getCoverageTags()

  const { stdout } = await execa('curl', ['-s', 'https://codecov.io/bash'], {
    stdout: 'pipe',
  })
  await pWriteFile('codecov.sh', stdout)
  await execa('bash', ['codecov.sh', `-f=${COVERAGE_PATH}`, ...tags, '-Z'])
  await pUnlink('codecov.sh')
}

const COVERAGE_PATH = 'coverage/coverage-final.json'

// Tag test coverage with OS and Node.js version
const getCoverageTags = function() {
  const os = PLATFORMS[platform()]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replace(/\./gu, '_')}`
  return [os, nodeVersion].map(getCoverageTag)
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
