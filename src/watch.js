'use strict'

const { promisify } = require('util')
const {
  argv: [, script, ...args],
  env: { GULP_WATCH },
} = require('process')

const { watch, parallel } = require('gulp')
const Nodemon = require('nodemon')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  files,
  task,
  { initial = true, ...watchOpts } = {},
) {
  const watchTask = getTask({ files, task, initial, watchOpts })
  addDescription({ watchTask, task, initial })
  return watchTask
}

// We do not use `func.bind()` to make the task name `watchTask` instead
// of `bound watchTask`
const getTask = function({ files, task, initial, watchOpts }) {
  if (GULP_WATCH !== 'no-restart') {
    return () => startNodemon()
  }

  const watchTask = () => watch(files, task, watchOpts)
  const watchTaskA = addInitial({ watchTask, task, initial })
  return watchTaskA
}

// We relaunch the same CLI command `gulp ...` but inside Nodemon.
// I.e. watching relaunches gulp when either:
//  - Gulp tasks changed
//  - Modules have been installed, updated or uninstalled
// This works with `gulp` (default task) and `gulp taskA taskB` (multiple tasks)
// We use an environment variable `GULP_WATCH` to distinguish between these
// modes
const startNodemon = async function() {
  const nodemon = new Nodemon({ ...NODEMON_CONFIG, script, args })

  // Otherwise Nodemon logs are silent
  // eslint-disable-next-line no-console, no-restricted-globals
  nodemon.on('log', ({ colour }) => console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

const NODEMON_CONFIG = {
  env: { GULP_WATCH: 'no-restart' },
  watch: [
    'gulpfile.*',
    'gulpfile.*.*',
    'gulp/',
    'package.json',
    'package-lock.json',
    'yarn.lock',
  ],
  delay: 100,
}

const addInitial = function({ watchTask, task, initial }) {
  if (initial === false) {
    return watchTask
  }

  if (initial === true) {
    return parallel(task, watchTask)
  }

  return parallel(initial, watchTask)
}

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
