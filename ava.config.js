// Ava requires configuration file to be a the repository's top-level

const SRC = 'src'
const BUILD_TEST = 'build/test'

// TODO: fix
// const LOG_PROCESS_ERRORS = new URL(
//   './build/src/tasks/unit/log_process_errors.js',
//   import.meta.url,
// ).pathname

export default {
  // We watch only for `*.js` files, otherwise `*.js.map` gets watched and it
  // creates issues.
  files: [`${BUILD_TEST}/**/*.js`, `!${BUILD_TEST}/helpers`],
  // Otherwise, if build watch is run as well, modifying source files trigger
  // tests twice
  ignoredByWatcher: [SRC],
  verbose: true,
  // Use `log-process-errors`
  // TODO: fix
  // require: [LOG_PROCESS_ERRORS],
  timeout: `3600s`,
}
