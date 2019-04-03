'use strict'

const { parallel } = require('gulp')
const { exec } = require('gulp-execa')

const { DEPENDENCIES } = require('../files')
const { getWatchTask } = require('../watch')

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await exec('npm audit -h', { stdout: 'ignore' })
  } catch {
    return
  }

  // Only print `npm audit` output if it failed
  try {
    await exec('npm audit', { stdout: 'ignore' })
  } catch (error) {
    await exec('npm audit', { reject: false })
    throw error
  }
}

const outdated = () => exec('npm outdated')

const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

const warnw = getWatchTask(DEPENDENCIES, warn)

module.exports = {
  warn,
  warnw,
}
