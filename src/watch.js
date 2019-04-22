import { promisify } from 'util'

import { watch } from 'gulp'

// Watch files to run a task.
// Returns the watch task.
export const getWatchTask = function(files, task, watchOptions) {
  const watchOptionsA = { ...DEFAULT_WATCH_OPTIONS, ...watchOptions }
  // We do not use `func.bind()` to make the task name `watchTask` instead
  // of `bound watchTask`
  const watchTask = () =>
    startWatch({ files, task, watchOptions: watchOptionsA })
  addDescription({ watchTask, task })
  return watchTask
}

const DEFAULT_WATCH_OPTIONS = { ignoreInitial: false }

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

// Add Gulp `taks.description` by re-using the watched task's description
const addDescription = function({ watchTask, task }) {
  if (typeof task !== 'function' || typeof task.description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${task.description} (watch mode)`
}
