'use strict'

const { src, series, parallel } = require('gulp')
const jscpd = require('gulp-jscpd')

const { CHECK } = require('../files')
const gulpExeca = require('../exec')
const { getWatchTask } = require('../watch')

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

const dup = () =>
  src(CHECK).pipe(
    jscpd({
      verbose: true,
      blame: true,
      'min-lines': 0,
      'min-tokens': 30,
      'skip-comments': true,
    }),
  )

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await gulpExeca('npm audit -h', { stdout: 'ignore' })
  } catch {
    return
  }

  await gulpExeca('npm audit', { stdout: 'ignore' })
}

const outdated = () => gulpExeca('npm outdated')

const check = parallel(lint, dup)

// eslint-disable-next-line fp/no-mutation
check.description = 'Lint and check for code duplication'

const checkw = getWatchTask(check, CHECK)

const fullCheck = parallel(lint, dup, audit, outdated)

// eslint-disable-next-line fp/no-mutation
fullCheck.description =
  'Lint, check for code duplication and outdated/vulnerable dependencies'

module.exports = {
  check,
  checkw,
  fullCheck,
}
