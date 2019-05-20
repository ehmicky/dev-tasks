import { parallel } from 'gulp'
import { exec } from 'gulp-execa'

import { DEPENDENCIES } from '../files.js'
import { getWatchTask } from '../watch.js'

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await exec('npm audit -h')
  } catch {
    return
  }

  try {
    await exec('npm audit --color=always')
  } catch (error) {
    // Only print `npm audit` output if it failed.
    // eslint-disable-next-line no-console, no-restricted-globals
    console.error(error.stdout)
    throw error
  }
}

const outdated = () => exec('npm outdated', { verbose: true })

export const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

export const warnw = getWatchTask(DEPENDENCIES, warn)
