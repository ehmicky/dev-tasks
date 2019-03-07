'use strict'

const { argv } = require('process')

const findUp = require('find-up')
const moize = require('moize').default
const { src, lastRun } = require('gulp')
const { stream: streamExec } = require('gulp-execa')
const streamToPromise = require('stream-to-promise')

const { BUILD, BUILD_TEST } = require('../../files')
const { getWatchTask } = require('../../watch')

const { addCoverage, uploadCoverage, checkCoverage } = require('./coverage')

// Run `ava` and `nyc`
const unit = async function() {
  const ava = await getAva()
  const avaA = await addCoverage(ava)

  const stream = src(BUILD_TEST, { dot: true, since: lastRun(unit) }).pipe(
    streamExec(({ path }) => `${avaA}${path}`, {
      stdout: 'inherit',
      stderr: 'inherit',
    }),
  )
  await streamToPromise(stream)

  await uploadCoverage()
}

// Allow passing flags to `ava`.
// Can also use `--inspect` or `--inspect-brk`.
const getAva = async function() {
  // eslint-disable-next-line no-magic-numbers
  const args = argv.slice(3)
  const { args: argsA, inspect } = extractInspect(args)
  const argsStr = argsA.join(' ')

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

// eslint-disable-next-line fp/no-mutation
unit.description = 'Run unit tests'

const unitw = getWatchTask(BUILD, unit)

const coverage = checkCoverage
// eslint-disable-next-line fp/no-mutation
coverage.description = 'Ensure source files are fully covered by tests'

module.exports = {
  unit,
  unitw,
  coverage,
}
