'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpPrettier = require('gulp-prettier')
const gulpIf = require('gulp-if')

const { JAVASCRIPT, MARKDOWN } = require('../files')
const { task } = require('../exec')
const { getWatchTask } = require('../watch')

const prettierConfig = require('./.prettierrc')
const { jscpd } = require('./jscpd')

const ESLINT_CONFIG = `${__dirname}/.eslintrc.json`

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
  )} --config ${ESLINT_CONFIG} --ignore-path=.gitignore --fix --cache --format=codeframe --max-warnings=0 --report-unused-disable-directives`,
)

const eslintWatch = function() {
  return src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    since: lastRun(eslintWatch),
  })
    .pipe(
      gulpEslint({
        config: ESLINT_CONFIG,
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
