'use strict'

const { src, dest, lastRun } = require('gulp')
const gulpPrettier = require('gulp-prettier')
const gulpIf = require('gulp-if')

const { JAVASCRIPT, MARKDOWN } = require('../../files')
const { bind, silentAsync } = require('../../utils')

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
    .pipe(gulpIf(isPrettified, dest(({ base }) => base)))
}

const prettierLoose = bind(prettier, 'loose')
const prettierStrict = bind(prettier, 'strict')
const prettierSilent = silentAsync(bind(prettier, 'silent'))

const isPrettified = function({ isPrettier }) {
  return isPrettier
}

module.exports = {
  prettierLoose,
  prettierStrict,
  prettierSilent,
}
