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
  const watchTask = () => startWatch({ files, watchOptions, task })
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

const startWatch = function({ files, watchOptions, task }) {
  // We do not return `watcher` because we want the task to complete once
  // watching is setup.
  watch(files, watchOptions, task)

  // We should wait for either `ready` or `error` event (with `Promise.race()`)
  // before completing the task, but there is a bug currently:
  //   https://github.com/paulmillr/chokidar/issues/835
  return Promise.resolve()
}

// Add Gulp `taks.description` by re-using the watched task's description
const addDescription = function({ watchTask, task }) {
  if (typeof task !== 'function' || typeof task.description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${task.description} (watch mode)`
}
