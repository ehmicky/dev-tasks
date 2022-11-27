import { cwd } from 'node:process'

import { exec } from 'gulp-execa'
import { pathExists } from 'path-exists'

import { TYPESCRIPT, TYPESCRIPT_CONFIG, TYPESCRIPT_TESTS } from '../files.js'
import { getWatchTask } from '../watch.js'

export const type = async function () {
  if (!(await pathExists('tsconfig.json')) || isSelf()) {
    return
  }

  await exec(`tsd --files ${TYPESCRIPT_TESTS}`, { echo: false })
}

const isSelf = function () {
  return cwd().includes('dev-tasks')
}

// eslint-disable-next-line fp/no-mutation
type.description = 'Run TypeScript type tests'

export const typeWatch = getWatchTask([TYPESCRIPT, TYPESCRIPT_CONFIG], type)
