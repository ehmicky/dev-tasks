import execa from 'execa'
import fastGlob from 'fast-glob'
import PluginError from 'plugin-error'

import { JAVASCRIPT } from '../../files.js'

const JSCPD_CONFIG = `${__dirname}/.jscpd.json`

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
// jscpd does not support globbing:
//   https://github.com/kucherenko/jscpd/issues/388
// so we need to use `fast-glob`
// jscpd does not provide with exit codes:
//   https://github.com/kucherenko/jscpd/issues/387
// so we need to parse its stdout instead
// The programmatic usage is too complex:
//   https://github.com/kucherenko/jscpd/issues/389
export const jscpd = async () => {
  const files = await fastGlob(JAVASCRIPT)
  const { stdout } = await execa('jscpd', ['--config', JSCPD_CONFIG, ...files])

  if (stdout.trim().includes(NO_CLONES_MESSAGE)) {
    return
  }

  throw new PluginError(
    'gulp-jscpd',
    `Found some code duplication\n\n${stdout}`,
  )
}

const NO_CLONES_MESSAGE = 'Found 0 clones'
