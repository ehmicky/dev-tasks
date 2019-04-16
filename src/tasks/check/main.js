import { parallel } from 'gulp'

import { JAVASCRIPT, MARKDOWN } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import { lint, lintWatch } from './lint.js'
import { jscpd } from './jscpd.js'

const check = parallel(lint(), jscpd)
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
