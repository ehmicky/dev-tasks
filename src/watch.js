'use strict'

const { promisify } = require('util')
const {
  argv: [, script, ...args],
  env: { GULP_WATCH },
} = require('process')

const { watch, parallel } = require('gulp')
const asyncDone = require('async-done')
const Nodemon = require('nodemon')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  files,
  task,
  { initial = true, gulpfiles = [], ...watchOptions } = {},
) {
  const watchTask = getTask({ files, task, initial, gulpfiles, watchOptions })
  addDescription({ watchTask, task, initial })
  return watchTask
}

// We do not use `func.bind()` to make the task name `watchTask` instead
// of `bound watchTask`
const getTask = function({ files, task, initial, gulpfiles, watchOptions }) {
  if (GULP_WATCH !== 'no-restart') {
    return () => startNodemon({ gulpfiles })
  }

  const watchTask = () => startWatch({ files, task, watchOptions })
  const watchTaskA = addInitial({ watchTask, task, initial })
  return watchTaskA
}

const startWatch = async function({ files, task, watchOptions }) {
  if (files.length === 0) {
    return
  }

  const watcher = watch(files, watchOptions, task)
  await Promise.race([
    promisify(watcher.on.bind(watcher))('ready'),
    promisify(watcher.on.bind(watcher))('error'),
  ])
}

// We relaunch the same CLI command `gulp ...` but inside Nodemon.
// I.e. watching relaunches gulp when either:
//  - Gulp tasks changed
//  - Modules have been installed, updated or uninstalled
// This works with `gulp` (default task) and `gulp taskA taskB` (multiple tasks)
// We use an environment variable `GULP_WATCH` to distinguish between these
// modes
const startNodemon = async function({ gulpfiles }) {
  const nodemonConfig = getNodemonConfig({ gulpfiles })
  const nodemon = new Nodemon(nodemonConfig)

  // Otherwise Nodemon logs are silent
  // eslint-disable-next-line no-console, no-restricted-globals
  nodemon.on('log', ({ colour }) => console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

const getNodemonConfig = function({ gulpfiles }) {
  return {
    script,
    args,
    env: { GULP_WATCH: 'no-restart' },
    watch: [
      'gulpfile.*',
      'gulpfile.*.*',
      'gulp/',
      'package.json',
      'package-lock.json',
      'yarn.lock',
      ...gulpfiles,
    ],
    delay: 100,
    // Does not use `nodemon.config` if one exists
    configFile: ' ',
  }
}

// Run the watched task in the beginning of the watch unless `opts.initial` is
// `false`. `opts.initial` can either be `true` or a function.
const addInitial = function({ watchTask, task, initial }) {
  if (initial === false) {
    return watchTask
  }

  const initialTask = initial === true ? task : initial
  return parallel(allowInitialFailure(initialTask), watchTask)
}

// If the initial task fails, make initial run still succeeds so that watching
// keeps running
const allowInitialFailure = function(func) {
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  const funcA = callback => asyncDone(func, () => callback())

  // eslint-disable-next-line fp/no-mutation
  funcA.displayName = 'initial'
  return funcA
}

// Add Gulp `taks.description` by re-using the watched task's or initial task's
// description
const addDescription = function({ watchTask, task, initial }) {
  const taskA = [initial, task].find(hasDescription)

  if (!hasDescription(taskA)) {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${taskA.description} (watch mode)`
}

const hasDescription = function(task) {
  return typeof task === 'function' && typeof task.description === 'string'
}

module.exports = {
  getWatchTask,
}
