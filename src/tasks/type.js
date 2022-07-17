import { cwd } from 'process'

import { exec } from 'gulp-execa'
import { pathExists } from 'path-exists'

import { TYPES } from '../files.js'
import { getWatchTask } from '../watch.js'

export const type = async function () {
  if (!(await pathExists('tsconfig.json')) || isSelf()) {
    return
  }

  await exec('tsd')
}

const isSelf = function () {
  return cwd().includes('dev-tasks')
}

// eslint-disable-next-line fp/no-mutation
type.description = 'Run TypeScript type tests'

export const typew = getWatchTask(TYPES, type)
