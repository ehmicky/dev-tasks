const { promisify } = require('util')

const { watch, parallel } = require('gulp')
const asyncDone = require('async-done')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  files,
  task,
  { initial = true, ...watchOptions } = {},
) {
  const watchTask = getTask({ files, task, initial, watchOptions })
  addDescription({ watchTask, task, initial })
  return watchTask
}

// We do not use `func.bind()` to make the task name `watchTask` instead
// of `bound watchTask`
const getTask = function({ files, task, initial, watchOptions }) {
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
