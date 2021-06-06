// Ava requires configuration file to be a the repository's top-level

// eslint-disable-next-line import/unambiguous
const SRC = 'src'
const BUILD_TEST = 'build/test'

// eslint-disable-next-line unicorn/prefer-module
const LOG_PROCESS_ERRORS = `${__dirname}/build/src/tasks/unit/log_process_errors.js`

// Ava configuration file does not fully support ES modules yet
// eslint-disable-next-line import/no-commonjs, unicorn/prefer-module
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
