import { platform } from 'process'

export default {
  verbose: true,
  // We have already compiled the tests with Babel..
  // Letting ava compile creates too many issues.
  babel: false,
  // Must be used otherwise babel is still performed
  compileEnhancements: false,
  // Workaround for https://github.com/istanbuljs/istanbuljs/issues/141
  serial: platform === 'win32',
}
