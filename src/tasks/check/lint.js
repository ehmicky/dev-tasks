'use strict'

const { argv } = require('process')

const { series } = require('gulp')
const isCi = require('is-ci')

const { asyncDonePromise } = require('../../utils')

const { prettierLoose, prettierStrict, prettierSilent } = require('./prettier')
const {
  eslintLoose,
  eslintStrict,
  eslintSilent,
  eslintWatch,
} = require('./eslint')

// `gulp lint` is `eslint` + `prettier`. It runs in 3 different modes:
//  - `loose`: run by `gulp check`. Autofixable errors are fixed and do not emit
//    errors.
//  - `full`: run before `git push`. Autofixable errors are fixed but emit
//    errors.
//  - `strict`: run in CI. Autofixable errors are not fixed and emit errors.
const lint = function() {
  if (argv.slice(2).some(isFullArg)) {
    return lintFull
  }

  if (isCi) {
    return lintStrict
  }

  return lintLoose
}

// `gulp check --full` is run before `git push`
const isFullArg = function(arg) {
  return arg === '--full'
}

const lintFull = async function() {
  try {
    await asyncDonePromise(lintStrict)
    // If linting fails, we run it again but in `silent` mode, i.e. it will
    // autofix what can be but silently.
  } catch (error) {
    await asyncDonePromise(lintSilent)
    throw error
  }
}

const lintStrict = series(prettierStrict, eslintStrict)
const lintLoose = series(prettierLoose, eslintLoose)
const lintSilent = series(prettierSilent, eslintSilent)
const lintWatch = series(prettierLoose, eslintWatch)

module.exports = {
  lint,
  lintWatch,
}
