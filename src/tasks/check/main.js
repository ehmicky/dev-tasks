import gulp from 'gulp'

import {
  JAVASCRIPT,
  TYPESCRIPT,
  MARKDOWN,
  JSON_YAML,
  IGNORED_SOURCES,
} from '../../files.js'
import { getWatchTask } from '../../watch.js'

import { jscpd } from './jscpd.js'
import { lint, lintWatch } from './lint.js'

export const check = gulp.parallel(lint(), jscpd)
// TODO: add `jscpd` in watch mode
const checkWatchRun = gulp.parallel(lintWatch)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'

const checkWatchTask = getWatchTask(
  [
    JAVASCRIPT,
    TYPESCRIPT,
    MARKDOWN,
    ...JSON_YAML,
    ...IGNORED_SOURCES.map((ignoredSource) => `!${ignoredSource}`),
  ],
  checkWatchRun,
)

export const checkWatch = gulp.series(check, checkWatchTask)

// eslint-disable-next-line fp/no-mutation
checkWatch.description = 'Lint/check source files (watch mode)'
