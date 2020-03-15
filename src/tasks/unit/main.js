import { exec } from 'gulp-execa'

import { getNyc } from '../cover/nyc.js'

// Run `ava` and `nyc`
// To pass arguments to `ava`, one should use `ava` directly instead of the
// Gulp task.
const runAva = async function (args, options) {
  const nyc = getNyc()
  await exec(`${nyc}ava${args}`, options)
}

export const unit = () => runAva('', {})

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
export const unitw = () => runAva(' -w', { stdin: 'inherit' })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'
