import { platform } from 'process'

// `.` points to the root directory because this file is loaded with `esm` from
// the root `ava.config.js`.
// eslint-disable-next-line node/no-missing-import, import/no-unresolved
import { BUILD, BUILD_TEST } from './src/files.js'

const LOG_PROCESS_ERRORS = './src/tasks/unit/log_process_errors.js'

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
