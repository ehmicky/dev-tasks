import { series, parallel } from 'gulp'

import { JAVASCRIPT, MARKDOWN, JSON_YAML } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import { lint, lintWatch } from './lint.js'
import { jscpd } from './jscpd.js'

export const check = parallel(lint(), jscpd)
const checkWatch = parallel(lintWatch, jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint/check source files'

const checkWatchTask = getWatchTask(
  [JAVASCRIPT, MARKDOWN, ...JSON_YAML],
  checkWatch,
)

export const checkw = series(check, checkWatchTask)

// eslint-disable-next-line fp/no-mutation
checkw.description = 'Lint/check source files (watch mode)'
