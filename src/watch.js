'use strict'

const { promisify } = require('util')

const { watch, task: getGulpTask } = require('gulp')

const getWatchTask = function(task, files, watchOpts) {
  const taskA = getTask({ task })
  const watchTask = runWatch.bind(null, { task: taskA, files, watchOpts })
  addDescription({ watchTask, task: taskA })
  return watchTask
}

const getTask = function({ task }) {
  if (typeof task !== 'string') {
    return task
  }

  return getGulpTask(task)
}

const runWatch = async function({
  task,
  files,
  watchOpts: { initial = true, ...watchOpts } = {},
}) {
  if (initial) {
    await task()
  }

  const watcher = watch(files, task, watchOpts)

  // Wait for watching to be setup to mark the `watch` task as complete
  await promisify(watcher.on.bind(watcher))('ready')
}

const addDescription = function({ watchTask, task: { description } }) {
  if (typeof description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${description} (watch mode)`
}

module.exports = {
  getWatchTask,
}
