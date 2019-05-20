import { argv } from 'process'

import { exec } from 'gulp-execa'

import { isAvaDebug, getAvaDebug } from './debug.js'
import { addCoverage, uploadCoverage, checkCoverage } from './coverage.js'

// Run `ava` and `nyc`
const runAva = async function(args, options) {
  const ava = await getAva(args)
  const avaA = await addCoverage(ava)

  await exec(avaA, { verbose: true, ...options })

  await uploadCoverage()
}

// Allow passing flags to `ava`.
// Must use `--files=FILE` to select a single file.
// Can also use `--inspect` or `--inspect-brk` but only if `--files` is used.
const getAva = function(extraArgs) {
  const args = [...argv.slice(3), ...extraArgs].join(' ')

  if (isAvaDebug({ args })) {
    return getAvaDebug({ args })
  }

  return `ava ${args}`
}

export const unit = () => runAva([], {})

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
export const unitw = () => runAva(['-w'], { stdin: 'inherit' })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

export const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'
