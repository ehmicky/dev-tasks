// The current directory is the caller's `ava.config.js` directory, because it's
// loaded with `esm`. The `esm` configuration used by Ava is also hard to work
// with when mixed with CommonJS (from the `build/` folder), making it hard to:
//  - load `files.js`, so we inline it instead, and use `__dirname`.
//  - load `ava.config.js` from inside `build/src/`, so we define the whole
//    configuration here instead.
const BUILD = 'build'
const BUILD_TEST = 'build/test'

const LOG_PROCESS_ERRORS = `${__dirname}/build/src/tasks/unit/log_process_errors.js`

export default {
  // We watch only for `*.js` files, otherwise `*.js.map` gets watched and it
  // creates issues.
  files: [`${BUILD_TEST}/**/*.js`],
  helpers: [`${BUILD_TEST}/helpers/**/*.js`],
  // Otherwise tests are triggered in watch mode on `src` changes too,
  // i.e. triggered twice.
  sources: [`${BUILD}/**/*.js`],
  verbose: true,
  // We have already compiled the tests with Babel.
  // Letting ava compile creates too many issues.
  babel: false,
  // Must be used otherwise babel is still performed
  compileEnhancements: false,
  // Use `log-process-errors`
  require: [LOG_PROCESS_ERRORS],
}
