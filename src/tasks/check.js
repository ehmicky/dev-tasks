'use strict'

const { src, dest, series, parallel, lastRun } = require('gulp')
const gulpEslint = require('gulp-eslint')
const gulpIf = require('gulp-if')

const { CHECK } = require('../files')
const gulpExeca = require('../exec')
const { getWatchTask } = require('../watch')

const { jscpd } = require('./jscpd')

const format = () =>
  gulpExeca(`prettier --write --loglevel warn ${CHECK.join(' ')}`)

// We do not use `gulp-eslint` because it does not support --cache
const eslint = function() {
  const files = CHECK.map(escapePattern).join(' ')
  return gulpExeca(
    `eslint ${files} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`,
  )
}

const eslintWatch = function() {
  return src(CHECK, { dot: true, since: lastRun(eslintWatch) })
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

const escapePattern = function(pattern) {
  return `"${pattern}"`
}

const lint = series(format, eslint)
const check = parallel(lint, jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint and check for code duplication'

const checkw = getWatchTask(check, CHECK)

module.exports = {
  check,
  checkw,
  eslint,
  eslintWatch,
}
