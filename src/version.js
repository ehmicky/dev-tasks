'use strict'

const { version } = require('process')
const assert = require('assert')

// eslint-disable-next-line import/no-internal-modules
const [{ version: latestVersion }] = require('node-releases/data/raw/nodejs')

const getLatestVersion = function() {
  return latestVersion
}

const testLatestVersion = function() {
  return version === getLatestVersion()
}

const assertLatestVersion = function() {
  assert(
    testLatestVersion(),
    `Please use latest Node.js version ${latestVersion}. Current version is ${version}.`,
  )
}

// eslint-disable-next-line require-await
const checkNodeVersion = async () => assertLatestVersion()

module.exports = {
  checkNodeVersion,
}
