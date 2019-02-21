'use strict'

const { JSCPD } = require('jscpd')
const fastGlob = require('fast-glob')
const PluginError = require('plugin-error')

const { CHECK } = require('../files')

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
const jscpd = async () => {
  // Must re-create instance otherwise it does not work
  const jscpdInstance = new JSCPD(JSCPD_OPTS)

  const files = await fastGlob(CHECK)
  const clones = await jscpdInstance.detectInFiles(files)

  if (clones.length === 0) {
    return
  }

  throw new PluginError(
    'gulp-jscpd',
    `Found ${clones.length} instances of code duplication`,
  )
}

const JSCPD_OPTS = {
  reporters: ['consoleFull'],
  minLines: 1,
  minTokens: 30,
  mode: 'weak',
}

module.exports = {
  jscpd,
}
