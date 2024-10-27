import { pipeline } from 'node:stream/promises'

import config from '@ehmicky/prettier-config'
import gulp from 'gulp'
import gulpIf from 'gulp-if'
import gulpPrettier from 'gulp-prettier'
import { format } from 'prettier'

import {
  IGNORED_SOURCES,
  JAVASCRIPT,
  JSON_YAML,
  MARKDOWN,
  TYPESCRIPT,
} from '../../files.js'
import { bind } from '../../utils.js'

// TODO: use `--cache`. It does not work programmatically.
const prettier = (mode) => {
  const stream = gulp.src(
    [
      JAVASCRIPT,
      TYPESCRIPT,
      MARKDOWN,
      ...JSON_YAML,
      ...IGNORED_SOURCES.map((ignoredSource) => `!${ignoredSource}`),
    ],
    {
      dot: true,
      // `prettierLoose()` is used in watch mode
      since: gulp.lastRun(prettierLoose),
    },
  )

  return mode === 'strict'
    ? pipeline(stream, gulpPrettier.check(config))
    : pipeline(
        stream,
        gulpPrettier(config),
        gulpIf(isPrettified, gulp.dest(getBase)),
      )
}

export const prettierLoose = bind(prettier, 'loose')
export const prettierStrict = bind(prettier, 'strict')
export const prettierSilent = bind(prettier, 'silent')

const isPrettified = ({ isPrettier }) => isPrettier

const getBase = ({ base }) => base

// Prettier wraps `CHANGELOG.md`, but not GitHub release notes
export const prettierReleaseNotes = async (contents) =>
  await format(contents, { ...config, parser: 'markdown', proseWrap: 'never' })
