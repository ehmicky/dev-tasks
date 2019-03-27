// We can't put this file under `src/` because it uses ES imports while the
// rest of the code does not. This would create issues with building and linting
// the `src/` directory.
// Also `ava` only allows this file to be at the root directory.
import { platform } from 'process'

// We can't require `src/files.json` because it's not published by npm.
// But we can't require `build/src/files.json` because `gulp check` would fail
// if the repository has not run `gulp build` yet. So we inline the paths.
const BUILD = 'build'
const BUILD_TEST = 'build/test'
const LOG_PROCESS_ERRORS = `${__dirname}/build/src/tasks/unit/log_process_errors.js`

export default {
  // We watch only for `*.js` files, otherwise `*.js.map` gets watched and it
  // creates issues.
  files: [`${BUILD_TEST}/**/*.js`],
  // Otherwise tests are triggered in watch mode on `src` changes too,
  // i.e. triggered twice.
  sources: [`${BUILD}/**/*.js`],
  verbose: true,
  // We have already compiled the tests with Babel..
  // Letting ava compile creates too many issues.
  babel: false,
  // Must be used otherwise babel is still performed
  compileEnhancements: false,
  // Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
  serial: platform === 'win32',
  // Use `log-process-errors`
  require: [LOG_PROCESS_ERRORS],
}
