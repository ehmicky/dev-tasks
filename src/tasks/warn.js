import gulp from 'gulp'
import { exec } from 'gulp-execa'

import { DEPENDENCIES } from '../files.js'
import { getWatchTask } from '../watch.js'

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await exec('npm audit -h', { verbose: false })
  } catch {
    return
  }

  try {
    await exec('npm audit --color=always', { verbose: false, all: true })
  } catch (error) {
    // Only print `npm audit` output if it failed.
    // eslint-disable-next-line no-console, no-restricted-globals
    console.error(error.all)
    throw error
  }
}

const outdated = () => exec('npm outdated')

export const warn = gulp.parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

export const warnWatch = getWatchTask(DEPENDENCIES, warn)
