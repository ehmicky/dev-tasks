import { argv } from 'process'

import { series } from 'gulp'
import isCi from 'is-ci'

import { asyncDonePromise } from '../../utils.js'

import { prettierLoose, prettierStrict, prettierSilent } from './prettier.js'
import {
  eslintLoose,
  eslintStrict,
  eslintSilent,
  eslintWatch,
} from './eslint.js'

// `gulp lint` is `eslint` + `prettier`. It runs in 3 different modes:
//  - `loose`: run by `gulp check`. Autofixable errors are fixed and do not emit
//    errors.
//  - `full`: run before `git push`. Autofixable errors are fixed but emit
//    errors.
//  - `strict`: run in CI. Autofixable errors are not fixed and emit errors.
export const lint = function() {
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
export const lintWatch = series(prettierLoose, eslintWatch)
