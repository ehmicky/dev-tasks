import { fileURLToPath } from 'node:url'

import { exec } from 'gulp-execa'
import pFilter from 'p-filter'
import { pathExists } from 'path-exists'

import {
  JAVASCRIPT_EXTS_STR,
  SOURCES_DIRS,
  TYPESCRIPT_EXT,
  TYPESCRIPT_TESTS_EXT,
} from '../../files.js'

const JSCPD_CONFIG = fileURLToPath(new URL('.jscpd.json', import.meta.url))

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
// We cannot expand globbing patterns ourselves because it can hit the CLI
// max length.
export const jscpd = async () => {
  const sourceDirs = await pFilter(SOURCES_DIRS, pathExists)

  if (sourceDirs.length === 0) {
    return
  }

  // Run twice to avoid printing anything when there are no clones
  try {
    await runJscpd(sourceDirs, true)
  } catch {
    await runJscpd(sourceDirs, false)
  }
}

const runJscpd = async (sourceDirs, silent) => {
  const sourceDirsStr = sourceDirs.join(' ')
  await exec(
    `jscpd --config=${JSCPD_CONFIG} --pattern=**/*.{${JAVASCRIPT_EXTS_STR},${TYPESCRIPT_EXT}} --ignore=**/*.${TYPESCRIPT_TESTS_EXT} ${sourceDirsStr}`,
    { echo: false, stdout: silent ? 'ignore' : 'inherit' },
  )
}
