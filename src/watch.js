import { watch } from 'gulp'
import renameFn from 'rename-fn'

// Same as `gulp.watch()` except:
//  - return directly a Gulp task.
//  - default `ignoreInitial` to `false`, i.e. first run the task before
//    watching.
//  - wait for watching to be initialized before resolving the task.
//  - automatically add a task name.
//  - automatically add a task description.
export const getWatchTask = function (files, firstArg, secondArg) {
  const [watchOptions, task] = parseOptions(firstArg, secondArg)

  const watchTask = startWatch.bind(null, files, watchOptions, task)

  addName(watchTask, task)
  addDescription(watchTask, task)

  return watchTask
}

// We use the same signature as `gulp.watch()`.
// `gulp.watch()` allow both `watchOptions` and `task` to be optional.
// We need to normalize this before adding default options.
const parseOptions = function (firstArg, secondArg) {
  if (typeof firstArg !== 'object' || firstArg === null) {
    return [DEFAULT_WATCH_OPTIONS, firstArg]
  }

  return [{ ...DEFAULT_WATCH_OPTIONS, ...firstArg }, secondArg]
}

const DEFAULT_WATCH_OPTIONS = { ignoreInitial: false }

const startWatch = function (files, watchOptions, task) {
  // We do not return `watcher` because we want the task to complete once
  // watching is setup.
  watch(files, watchOptions, task)

  // We should wait for either `ready` or `error` event (with `Promise.race()`)
  // before completing the task, but there was a bug with Chokidar `2`.
  // Chokidar `3` fixes it but `gulp-watcher` won't update:
  //   https://github.com/gulpjs/glob-watcher/pull/41
  return Promise.resolve()
}

// Add `function.name` by re-using the watched task's name.
// This is used by Gulp when displaying the task, except when it has been
// assigned as a top-level task.
const addName = function (watchTask, task) {
  const name = getName(task)
  renameFn(watchTask, name)
}

const getName = function (task) {
  if (typeof task !== 'function' || INVALID_NAMES.includes(task.name)) {
    return 'watch'
  }

  return `watch ${task.name}`
}

const INVALID_NAMES = ['', 'parallel', 'series', 'watch']

// Add Gulp `task.description` by re-using the watched task's description
const addDescription = function (watchTask, task) {
  if (typeof task !== 'function' || typeof task.description !== 'string') {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  watchTask.description = `${task.description} (watch mode)`
}
