'use strict'

const { parallel } = require('gulp')

const { JAVASCRIPT, MARKDOWN } = require('../../files')
const { getWatchTask } = require('../../watch')

const { lint, lintWatch } = require('./lint')
const { jscpd } = require('./jscpd')

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
