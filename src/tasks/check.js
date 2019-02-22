'use strict'

const { series, parallel } = require('gulp')

const { CHECK } = require('../files')
const gulpExeca = require('../exec')
const { getWatchTask } = require('../watch')

const { jscpd } = require('./jscpd')

const format = () =>
  gulpExeca(`prettier --write --loglevel warn ${CHECK.join(' ')}`)

// We do not use `gulp-eslint` because it does not support --cache
const eslint = function() {
  const files = CHECK.map(escapePattern).join(' ')
  return gulpExeca(
    `eslint ${files} --ignore-path .gitignore --fix --cache --format codeframe --max-warnings 0 --report-unused-disable-directives`,
  )
}

const escapePattern = function(pattern) {
  return `"${pattern}"`
}

const lint = series(format, eslint)

const check = parallel(lint, jscpd)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint and check for code duplication'

const checkw = getWatchTask(check, CHECK)

module.exports = {
  check,
  checkw,
}
