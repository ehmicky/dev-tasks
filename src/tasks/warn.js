'use strict'

const { parallel } = require('gulp')

const execa = require('../exec')
const { WARN } = require('../files')
const { getWatchTask } = require('../watch')

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await execa('npm', ['audit', '-h'], { stdout: 'ignore' })
  } catch {
    return
  }

  await execa('npm', ['audit'], { stdout: 'ignore' })
}

const outdated = () => execa('npm', ['outdated'])

const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

const warnw = getWatchTask(WARN, warn)

module.exports = {
  warn,
  warnw,
}
