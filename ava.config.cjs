// Ava requires configuration file to be a the repository's top-level

const SRC = 'src'
const BUILD_TEST = 'build/test'

const LOG_PROCESS_ERRORS = `${__dirname}/build/src/tasks/unit/log_process_errors.js`

// Ava configuration file does not fully support ES modules yet
module.exports = {
  // We watch only for `*.js` files, otherwise `*.js.map` gets watched and it
  // creates issues.
  files: [`${BUILD_TEST}/**/*.js`, `!${BUILD_TEST}/helpers`],
  // Otherwise, if build watch is run as well, modifying source files trigger
  // tests twice
  ignoredByWatcher: [SRC],
  verbose: true,
  // Use `log-process-errors`
  require: [LOG_PROCESS_ERRORS],
  timeout: `3600s`,
}
