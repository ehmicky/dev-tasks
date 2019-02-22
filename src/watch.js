'use strict'

const { watch, parallel } = require('gulp')

// Watch files to run a task.
// Returns the watch task.
const getWatchTask = function(
  task,
  files,
  { initial = true, ...watchOpts } = {},
) {
  // We do not use `func.bind()` to make the task name `watchTask` instead
  // of `bound watchTask`
  const watchTask = () => watch(files, task, watchOpts)
  const watchTaskA = addInitial({ watchTask, task, initial })
  addDescription({ watchTask: watchTaskA, task, initial })
  return watchTaskA
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
