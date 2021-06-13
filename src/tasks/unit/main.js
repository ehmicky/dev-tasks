import { exec } from 'gulp-execa'

import { getC8 } from '../cover/c8.js'

// Run `ava` and `c8`
// To pass arguments to `ava`, one should use `ava` directly instead of the
// Gulp task.
const runAva = async function (args, options) {
  const c8 = getC8()
  await exec(`${c8}ava${args}`, options)
}

export const unit = () => runAva('', {})

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
export const unitw = () => runAva(' -w', { stdin: 'inherit' })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'
