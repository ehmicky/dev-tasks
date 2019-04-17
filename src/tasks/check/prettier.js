import { src, dest, lastRun } from 'gulp'
import gulpPrettier from 'gulp-prettier'
import gulpIf from 'gulp-if'
import config from 'eslint-config-standard-prettier-fp'

import { JAVASCRIPT, MARKDOWN } from '../../files.js'
import { bind, silentAsync } from '../../utils.js'

const prettier = function(mode) {
  const stream = src([...JAVASCRIPT, ...MARKDOWN], {
    dot: true,
    // `prettierLoose()` is used in watch mode
    since: lastRun(prettierLoose),
  })

  if (mode === 'strict') {
    return stream.pipe(gulpPrettier.check(config))
  }

  return stream
    .pipe(gulpPrettier(config))
    .pipe(gulpIf(isPrettified, dest(({ base }) => base)))
}

export const prettierLoose = bind(prettier, 'loose')
export const prettierStrict = bind(prettier, 'strict')
export const prettierSilent = silentAsync(bind(prettier, 'silent'))

const isPrettified = function({ isPrettier }) {
  return isPrettier
}
