import { version, platform } from 'node:process'
import { fileURLToPath } from 'node:url'

import { exec } from 'gulp-execa'

import { shouldCover } from './utils.js'

const CODECOV_SCRIPT = fileURLToPath(new URL('codecov.sh', import.meta.url))
// Run in Bash, i.e. should use slashes even on Windows
const COVERAGE_PATH = 'coverage/coverage-final.json'

// Upload test coverage to codecov
export const uploadCoverage = async () => {
  if (!(await shouldCover())) {
    return
  }

  const tags = getCoverageTags()
  await exec(`bash ${CODECOV_SCRIPT} -f ${COVERAGE_PATH} ${tags} -Z`, {
    reject: false,
  })
}

// Tag test coverage with OS and Node.js version
const getCoverageTags = () => {
  const os = PLATFORMS[platform]
  // `codecov` only allows restricted characters
  const nodeVersion = `node_${version.replaceAll('.', '_')}`
  return [os, nodeVersion].map(getCoverageTag).join(' ')
}

const PLATFORMS = {
  linux: 'linux',
  darwin: 'mac',
  win32: 'windows',
}

const getCoverageTag = (tag) => `-F ${tag}`
