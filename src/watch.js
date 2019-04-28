import { watch } from 'gulp'

// Same as `gulp.watch()` except:
//  - return directly a Gulp task.
//  - default `ignoreInitial` to `false`, i.e. first run the task before
//    watching.
//  - wait for watching to be initialized before resolving the task.
//  - automatically add a task description.
export const getWatchTask = function(files, firstArg, secondArg) {
  const { watchOptions, task } = parseOptions(firstArg, secondArg)
  // We do not use `func.bind()` to make the task name `watchTask` instead
  // of `bound watchTask`
  const watchTask = () => startWatch({ files, task, watchOptions })
  addDescription({ watchTask, task })
  return watchTask
}

// We use the same signature as `gulp.watch()`.
// `gulp.watch()` allow both `watchOptions` and `task` to be optional.
// We need to normalize this before adding default options.
const parseOptions = function(firstArg, secondArg) {
  const { watchOptions, task } = parseOptionals(firstArg, secondArg)
  const watchOptionsA = { ...DEFAULT_WATCH_OPTIONS, ...watchOptions }
  return { watchOptions: watchOptionsA, task }
}

const parseOptionals = function(firstArg, secondArg) {
  if (typeof firstArg === 'function' || !isObject(firstArg)) {
    return { task: firstArg }
  }

  return { watchOptions: firstArg, task: secondArg }
}

const isObject = function(value) {
  return value !== null && typeof value === 'object'
}

const DEFAULT_WATCH_OPTIONS = { ignoreInitial: false }

const startWatch = function({ files, task, watchOptions }) {
  if (files.length === 0) {
    return
  }

  // We do not wait for the `ready` event because it's not consistently emitted.
  return watch(files, watchOptions, task)
}

// Add Gulp `taks.description` by re-using the watched task's description
const addDescription = function({ watchTask, task }) {
  if (typeof task !== 'function' || typeof task.description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${task.description} (watch mode)`
}
