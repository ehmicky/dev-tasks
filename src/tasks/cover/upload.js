import { join } from 'path'
import { version, platform } from 'process'

import { exec } from 'gulp-execa'

import { shouldCover } from './utils.js'

const CODECOV_SCRIPT = join(__dirname, 'codecov.sh')
// Run in Bash, i.e. should use slashes even on Windows
const COVERAGE_PATH = 'coverage/coverage-final.json'

// Upload test coverage to codecov
export const uploadCoverage = async function () {
  if (!shouldCover()) {
    return
  }

  // eslint-disable-next-line no-console, no-restricted-globals, node/no-process-env, node/prefer-global/process
  console.log(process.env.CODECOV_TOKEN.length)
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
