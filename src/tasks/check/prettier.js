import { src, dest, lastRun } from 'gulp'
import gulpPrettier from 'gulp-prettier'
import gulpIf from 'gulp-if'
import prettierConfig from 'eslint-config-standard-prettier-fp/build/src/.prettierrc'

import { JAVASCRIPT, MARKDOWN } from '../../files.js'
import { bind, silentAsync } from '../../utils.js'

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
