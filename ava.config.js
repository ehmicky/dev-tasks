import { platform } from 'process'

import files from './build/src/files'

export default {
  files: [files.BUILD_TEST],
  // Otherwise tests are triggered in watch mode on `src` changes too,
  // i.e. triggered twice
  sources: [files.BUILD],
  // We have already compiled the tests with Babel..
  // Letting ava compile creates too many issues.
  babel: false,
  // Must be used otherwise babel is still performed
  compileEnhancements: false,
  // Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
  serial: platform === 'win32',
}
