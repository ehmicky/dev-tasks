'use strict'

const { argv } = require('process')

const findUp = require('find-up')
const moize = require('moize').default
const { exec } = require('gulp-execa')

const { getWatchTask } = require('../../watch')

const { addCoverage, uploadCoverage, checkCoverage } = require('./coverage')

// Run `ava` and `nyc`
const runAva = async function(args) {
  const ava = await getAva(args)
  const avaA = await addCoverage(ava)

  await exec(avaA)

  await uploadCoverage()
}

// Allow passing flags to `ava`.
// Can also use `--inspect` or `--inspect-brk`.
const getAva = async function(args) {
  // eslint-disable-next-line no-magic-numbers
  const argsA = [...argv.slice(3), ...args]
  const { args: argsB, inspect } = extractInspect(argsA)
  const argsStr = argsB.join(' ')

  if (inspect === undefined) {
    return `ava ${argsStr}`
  }

  const profile = await mGetAvaProfile()
  return `node ${inspect} ${profile} ${argsStr}`
}

const extractInspect = function(args) {
  const inspect = args.find(isInspectArg)
  const argsA = args.filter(arg => !isInspectArg(arg))
  return { args: argsA, inspect }
}

const isInspectArg = function(arg) {
  return arg.startsWith('--inspect')
}

// See https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-chrome-devtools.md
const getAvaProfile = function() {
  return findUp('node_modules/ava/profile.js')
}

const mGetAvaProfile = moize(getAvaProfile)

const unit = () => runAva([])

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

// Ava watch mode is better than using `gulp.watch()`
const unitwatch = () => runAva(['-w'])

// We use `getWatchTask()` only to restart `ava -w` on `package.json` changes,
// so we don't need the first two arguments.
const unitw = getWatchTask([], undefined, { initial: unitwatch })

// eslint-disable-next-line fp/no-mutation
unitw.description = 'Run unit tests (watch mode)'

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
