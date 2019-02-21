'use strict'

const { promisify } = require('util')

const { watch } = require('gulp')

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
  await initialTask()
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
