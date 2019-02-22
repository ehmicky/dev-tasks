'use strict'

const { promisify } = require('util')

const { watch, parallel } = require('gulp')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  task,
  files,
  { initial = true, ...watchOpts } = {},
) {
  const watchTask = runWatch.bind(null, { task, files, watchOpts })
  const watchTaskA = addInitial({ watchTask, task, initial })
  addDescription({ watchTask: watchTaskA, task, initial })
  return watchTaskA
}

const runWatch = async function({ task, files, watchOpts }) {
  const watcher = watch(files, task, watchOpts)

  // Wait for watching to be setup to mark the `watch` task as complete
  await promisify(watcher.on.bind(watcher))('ready')
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
