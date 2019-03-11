/* eslint-disable max-lines */
'use strict'

const { argv } = require('process')

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpPrettier = require('gulp-prettier')
const gulpIf = require('gulp-if')
const { exec } = require('gulp-execa')
const isCi = require('is-ci')

const { JAVASCRIPT, MARKDOWN } = require('../../files')
const { getWatchTask } = require('../../watch')
const { bind, silentAsync, asyncDonePromise } = require('../../utils')

const { jscpd } = require('./jscpd')
// eslint-disable-next-line import/max-dependencies
const prettierConfig = require('./.prettierrc')

const prettier = function(mode) {
  const stream = src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    // `prettierLoose()` is used in watch mode
    since: lastRun(prettierLoose),
  })

  if (mode === 'strict') {
    return stream.pipe(gulpPrettier.check(prettierConfig))
  }

  return stream
    .pipe(gulpPrettier(prettierConfig))
    .pipe(gulpIf(isPrettified, dest(getFileBase)))
}

const prettierStrict = bind(prettier, 'strict')
const prettierLoose = bind(prettier, 'loose')
const prettierSilent = silentAsync(bind(prettier, 'silent'))

const isPrettified = function({ isPrettier }) {
  return isPrettier
}

// `gulp-eslint` does not support --cache
// (https://github.com/adametry/gulp-eslint/issues/132)
// `gulp.lastRun()` allows linting only modified files, which is 10 times faster
// than using `eslint --cache`. However it does not persist the cache.
// This leads us to two use cases:
//   - `eslint` task is faster when not running in watch mode
//   - `eslintWatch` task is faster when running in watch mode
const eslint = function(mode) {
  const fix = mode === 'strict' ? '' : '--fix '
  const options =
    mode === 'silent' ? { stdout: 'ignore', stderr: 'ignore' } : {}

  return exec(
    `eslint ${JAVASCRIPT.join(' ')} ${MARKDOWN.join(
      ' ',
    )} --ignore-path=.gitignore ${fix}--cache --format=codeframe --max-warnings=0 --report-unused-disable-directives`,
    options,
  )
}

const eslintStrict = bind(eslint, 'strict')
const eslintLoose = bind(eslint, 'loose')
const eslintSilent = silentAsync(bind(eslint, 'silent'))

const eslintWatch = function() {
  return src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    since: lastRun(eslintWatch),
  })
    .pipe(
      gulpEslint({
        ignorePath: '.gitignore',
        fix: true,
        maxWarnings: 0,
        // eslint-disable-next-line id-length
        reportUnusedDisableDirectives: true,
      }),
    )
    .pipe(gulpEslint.format('codeframe'))
    .pipe(gulpEslint.failAfterError())
    .pipe(gulpIf(isFixed, dest(getFileBase)))
}

const isFixed = function({ eslint: { fixed } = {} }) {
  return fixed
}

const getFileBase = function({ base }) {
  return base
}

// `gulp lint` is `eslint` + `prettier`. It runs in 3 different modes:
//  - `loose`: run by `gulp check`. Autofixable errors are fixed and do not emit
//    errors.
//  - `full`: run before `git push`. Autofixable errors are fixed but emit
//    errors.
//  - `strict`: run in CI. Autofixable errors are not fixed and emit errors.
const lint = function() {
  if (argv.slice(2).some(isFullArg)) {
    return lintFull
  }

  if (isCi) {
    return lintStrict
  }

  return lintLoose
}

// `gulp check --full` is run before `git push`
const isFullArg = function(arg) {
  return arg === '--full'
}

const lintFull = async function() {
  try {
    await asyncDonePromise(lintStrict)
    // If linting fails, we run it again but in `silent` mode, i.e. it will
    // autofix what can be but silently.
  } catch (error) {
    await asyncDonePromise(lintSilent)
    throw error
  }
}

const lintStrict = series(prettierStrict, eslintStrict)
const lintLoose = series(prettierLoose, eslintLoose)
const lintSilent = series(prettierSilent, eslintSilent)
const lintWatch = series(prettierLoose, eslintWatch)

const check = parallel(lint(), jscpd)
const checkWatch = parallel(lintWatch, jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'

const checkw = getWatchTask([...JAVASCRIPT, ...MARKDOWN], checkWatch, {
  initial: check,
})

module.exports = {
  check,
  checkw,
}

/* eslint-enable max-lines */
