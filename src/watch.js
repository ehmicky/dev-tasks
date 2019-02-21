'use strict'

const { promisify } = require('util')

const { watch, task: getGulpTask } = require('gulp')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(task, files, watchOpts) {
  const taskA = getTask(task)
  const watchTask = runWatch.bind(null, { task: taskA, files, watchOpts })
  addDescription({ watchTask, task: taskA })
  return watchTask
}

const runWatch = async function({
  task,
  files,
  watchOpts: { initial = true, ...watchOpts } = {},
}) {
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
  if (typeof initial === 'string') {
    return getTask(initial)
  }

  if (typeof initial === 'function') {
    return initial
  }

  return task
}

const addDescription = function({ watchTask, task: { description } }) {
  if (typeof description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${description} (watch mode)`
}

const getTask = function(task) {
  if (typeof task !== 'string') {
    return task
  }

  return getGulpTask(task)
}

module.exports = {
  getWatchTask,
}
