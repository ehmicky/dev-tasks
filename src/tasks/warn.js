'use strict'

const { parallel } = require('gulp')

const { exec } = require('../exec')
const { WARN } = require('../files')
const { getWatchTask } = require('../watch')

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await exec('npm', ['audit', '-h'], { stdout: 'ignore' })
  } catch {
    return
  }

  await exec('npm', ['audit'], { stdout: 'ignore' })
}

const outdated = () => exec('npm', ['outdated'])

const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

const warnw = getWatchTask(WARN, warn)

module.exports = {
  warn,
  warnw,
}
