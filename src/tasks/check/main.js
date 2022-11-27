import gulp from 'gulp'

import {
  JAVASCRIPT,
  MARKDOWN,
  JSON_YAML,
  IGNORED_SOURCES,
} from '../../files.js'
import { getWatchTask } from '../../watch.js'

import { jscpd } from './jscpd.js'
import { lint, lintWatch } from './lint.js'

export const check = gulp.parallel(lint(), jscpd)
// TODO: add `jscpd` and `prettier` in watch mode
const checkWatch = gulp.parallel(lintWatch)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'

const checkWatchTask = getWatchTask(
  [
    JAVASCRIPT,
    MARKDOWN,
    ...JSON_YAML,
    ...IGNORED_SOURCES.map((ignoredSource) => `!${ignoredSource}`),
  ],
  checkWatch,
)

export const checkw = gulp.series(check, checkWatchTask)

// eslint-disable-next-line fp/no-mutation
checkw.description = 'Lint/check source files (watch mode)'
