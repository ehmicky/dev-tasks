import { exec } from 'gulp-execa'

// To pass arguments to `ava`, one should use `ava` directly instead of the
// Gulp task.
export const unit = () => exec('ava')

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
export const unitWatch = () => exec('ava -w', { stdin: 'inherit' })

// eslint-disable-next-line fp/no-mutation
unitWatch.description = 'Run unit tests (watch mode)'

const c8Command =
  'c8 --reporter=lcov --reporter=text --reporter=html --reporter=json'

export const unitCoverage = () => exec(`${c8Command} ava`)

// eslint-disable-next-line fp/no-mutation
unitCoverage.description = 'Run unit tests and compute test coverage'
