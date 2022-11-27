import { fileURLToPath } from 'node:url'

import { exec } from 'gulp-execa'
import pFilter from 'p-filter'
import { pathExists } from 'path-exists'

// import { JAVASCRIPT } from '../../files.js'

const JSCPD_CONFIG = fileURLToPath(new URL('.jscpd.json', import.meta.url))

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
// We cannot expand globbing patterns ourselves because it can hit the CLI
// max length.
export const jscpd = async function () {
  const sourceDirs = await pFilter(
    ['src', 'benchmark', 'docs', 'examples', 'gulp'],
    pathExists,
  )

  if (sourceDirs.length === 0) {
    return
  }

  await exec(
    `jscpd --config=${JSCPD_CONFIG} --pattern=**/*.ts --pattern=**/*.js --ignore=**/*.test-d.ts ${sourceDirs.join(
      ' ',
    )}`,
    { echo: false },
  )
}
