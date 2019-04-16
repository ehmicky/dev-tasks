import { JSCPD } from 'jscpd'
import fastGlob from 'fast-glob'
import PluginError from 'plugin-error'

import { JAVASCRIPT } from '../../files.js'

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
export const jscpd = async () => {
  const files = await fastGlob(JAVASCRIPT)
  const clones = await jscpdInstance.detectInFiles(files)

  if (clones.length === 0) {
    return
  }

  throw new PluginError(
    'gulp-jscpd',
    `Found ${clones.length} instances of code duplication`,
  )
}

const jscpdInstance = new JSCPD({
  reporters: ['consoleFull'],
  minLines: 1,
  maxLines: 5e3,
  minTokens: 35,
  // The default store uses LevelDB which is slower and creates a `.jscpd/`
  // directory. The `memory` store has issues with huge repositories though.
  storeOptions: { '*': { type: 'memory' } },
})
