import { platform } from 'process'

// eslint-disable-next-line import/extensions
import files from './build/src/files.json'

export default {
  // We watch only for `*.js` files, otherwise `*.js.map` gets watched and it
  // creates issues.
  files: [`${files.BUILD_TEST}/**/*.js`],
  // Otherwise tests are triggered in watch mode on `src` changes too,
  // i.e. triggered twice.
  sources: [`${files.BUILD}/**/*.js`],
  verbose: true,
  // We have already compiled the tests with Babel..
  // Letting ava compile creates too many issues.
  babel: false,
  // Must be used otherwise babel is still performed
  compileEnhancements: false,
  // Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
  serial: platform === 'win32',
}
