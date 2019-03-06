'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpPrettier = require('gulp-prettier')
const gulpIf = require('gulp-if')
const { task } = require('gulp-execa')

const { JAVASCRIPT, MARKDOWN } = require('../../files')
const { getWatchTask } = require('../../watch')

const { jscpd } = require('./jscpd')
const prettierConfig = require('./.prettierrc')

const prettier = function() {
  return src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    since: lastRun(prettier),
  })
    .pipe(gulpPrettier(prettierConfig))
    .pipe(gulpIf(isPrettified, dest(getFileBase)))
}

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
const eslint = task(
  `eslint ${JAVASCRIPT.join(' ')} ${MARKDOWN.join(
    ' ',
  )} --ignore-path=.gitignore --fix --cache --format=codeframe --max-warnings=0 --report-unused-disable-directives`,
)

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

const lint = series(prettier, eslint)
const lintWatch = series(prettier, eslintWatch)
const check = parallel(lint, jscpd)
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
