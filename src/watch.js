import { watch } from 'gulp'

// Same as `gulp.watch()` except:
//  - return directly a Gulp task.
//  - default `ignoreInitial` to `false`, i.e. first run the task before
//    watching.
//  - wait for watching to be initialized before resolving the task.
//  - automatically add a task description.
export const getWatchTask = function(files, firstArg, secondArg) {
  const [watchOptions, task] = parseOptions(firstArg, secondArg)
  // We do not use `func.bind()` to make the task name `watchTask` instead
  // of `bound watchTask`
  // Note that if the return value is assigned as a top-level task, the task
  // name will be that top-level task name.
  const watchTask = () => startWatch(files, watchOptions, task)
  addDescription(watchTask, task)
  return watchTask
}

// We use the same signature as `gulp.watch()`.
// `gulp.watch()` allow both `watchOptions` and `task` to be optional.
// We need to normalize this before adding default options.
const parseOptions = function(firstArg, secondArg) {
  if (typeof firstArg !== 'object' || firstArg === null) {
    return [DEFAULT_WATCH_OPTIONS, firstArg]
  }

  return [{ ...DEFAULT_WATCH_OPTIONS, ...firstArg }, secondArg]
}

const DEFAULT_WATCH_OPTIONS = { ignoreInitial: false }

const startWatch = function(files, watchOptions, task) {
  // We do not return `watcher` because we want the task to complete once
  // watching is setup.
  watch(files, watchOptions, task)

  // We should wait for either `ready` or `error` event (with `Promise.race()`)
  // before completing the task, but there was a bug with Chokidar `2`.
  // Chokidar `3` fixes it but `gulp-watcher` won't update:
  //   https://github.com/gulpjs/glob-watcher/pull/41
  return Promise.resolve()
}

// Add Gulp `taks.description` by re-using the watched task's description
const addDescription = function(watchTask, task) {
  if (typeof task !== 'function' || typeof task.description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${task.description} (watch mode)`
}
