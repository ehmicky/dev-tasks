'use strict'

const { promisify } = require('util')

const { watch } = require('gulp')
const asyncDone = require('async-done')

const pAsyncDone = promisify(asyncDone)

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  task,
  files,
  { initial = true, ...watchOpts } = {},
) {
  const watchTask = runWatch.bind(null, { task, files, initial, watchOpts })
  addDescription({ watchTask, task, initial })
  return watchTask
}

const runWatch = async function({ task, files, initial, watchOpts }) {
  await runInitialTask({ initial, task })

  const watcher = watch(files, task, watchOpts)

  // Wait for watching to be setup to mark the `watch` task as complete
  await promisify(watcher.on.bind(watcher))('ready')
}

const runInitialTask = async function({ initial, task }) {
  if (initial === false) {
    return
  }

  const initialTask = getInitialTask({ initial, task })
  // Gulp tasks use `async-done` to support several types of ways of making
  // a function async. E.g. gulp.series() uses a function callback.
  await pAsyncDone(initialTask)
}

const getInitialTask = function({ initial, task }) {
  if (typeof initial === 'function') {
    return initial
  }

  return task
}

const addDescription = function({ watchTask, task, initial }) {
  const description = getDescription({ initial, task })

  if (typeof description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${description} (watch mode)`
}

const getDescription = function({ initial, task }) {
  return [initial, task].map(getTaskDescription).find(Boolean)
}

const getTaskDescription = function({ description }) {
  return description
}

module.exports = {
  getWatchTask,
}
