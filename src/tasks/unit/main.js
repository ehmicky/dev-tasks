import { argv } from 'process'

import { exec } from 'gulp-execa'

import { getWatchTask } from '../../watch.js'

import { isAvaDebug, getAvaDebug } from './debug.js'
import { addCoverage, uploadCoverage, checkCoverage } from './coverage.js'

// Run `ava` and `nyc`
const runAva = async function(args, options) {
  const ava = await getAva(args)
  const avaA = await addCoverage(ava)

  await exec(avaA, options)

  await uploadCoverage()
}

// Allow passing flags to `ava`.
// Must use `--files=FILE` to select a single file.
// Can also use `--inspect` or `--inspect-brk` but only if `--files` is used.
const getAva = function(extraArgs) {
  // eslint-disable-next-line no-magic-numbers
  const args = [...argv.slice(3), ...extraArgs].join(' ')

  if (isAvaDebug({ args })) {
    return getAvaDebug({ args })
  }

  return `ava ${args}`
}

const unit = () => runAva([], {})

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
const unitwatch = () => runAva(['-w'], { stdio: 'inherit' })

// We use `getWatchTask()` only to restart `ava -w` on `package.json` changes,
// so we don't need the first two arguments.
const unitw = getWatchTask([], undefined, { initial: unitwatch })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
