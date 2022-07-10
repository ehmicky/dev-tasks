import config from '@ehmicky/eslint-config'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import gulpPrettier from 'gulp-prettier'

import { JAVASCRIPT, MARKDOWN, JSON_YAML } from '../../files.js'
import { bind } from '../../utils.js'

// TODO: use `--cache`. It does not work programmatically.
const prettier = function (mode) {
  const stream = gulp.src([JAVASCRIPT, MARKDOWN, ...JSON_YAML], {
    dot: true,
    // `prettierLoose()` is used in watch mode
    since: gulp.lastRun(prettierLoose),
  })

  if (mode === 'strict') {
    return stream.pipe(gulpPrettier.check(config))
  }

  return stream
    .pipe(gulpPrettier(config))
    .pipe(gulpIf(isPrettified, gulp.dest(getBase)))
}

export const prettierLoose = bind(prettier, 'loose')
export const prettierStrict = bind(prettier, 'strict')
export const prettierSilent = bind(prettier, 'silent')

const isPrettified = function ({ isPrettier }) {
  return isPrettier
}

const getBase = function ({ base }) {
  return base
}
