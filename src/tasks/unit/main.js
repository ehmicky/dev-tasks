import { exec } from 'gulp-execa'

import { getNyc, uploadCoverage, checkCoverage } from './coverage.js'

// Run `ava` and `nyc`
// To pass arguments to `ava`, one should use `ava` directly instead of the
// Gulp task.
const runAva = async function(args, options) {
  const nyc = await getNyc()

  await exec(`${nyc}ava${args}`, options)

  await uploadCoverage()
}

export const unit = () => runAva('', {})

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
export const unitw = () => runAva(' -w', { stdin: 'inherit' })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

export const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'
