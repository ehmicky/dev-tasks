// eslint-disable-next-line filenames/match-regex
import { platform } from 'process'

// eslint-disable-next-line import/no-internal-modules
import files from './build/src/files'

// eslint-disable-next-line import/no-default-export
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
