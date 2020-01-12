// The current directory is the caller's `ava.config.js` directory, because it's
// loaded with `esm`. The `esm` configuration used by Ava is also hard to work
// with when mixed with CommonJS (from the `build/` folder), making it hard to:
//  - load `files.js`, so we inline it instead, and use `__dirname`.
//  - load `ava.config.js` from inside `build/src/`, so we define the whole
//    configuration here instead.
// eslint-disable-next-line import/unambiguous
const SRC = 'src'
const BUILD_TEST = 'build/test'

const LOG_PROCESS_ERRORS = `${__dirname}/build/src/tasks/unit/log_process_errors.js`

// eslint-disable-next-line import/no-commonjs
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
