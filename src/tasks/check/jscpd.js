import { fileURLToPath } from 'node:url'

import { task } from 'gulp-execa'

// import { JAVASCRIPT } from '../../files.js'

const JSCPD_CONFIG = fileURLToPath(new URL('.jscpd.json', import.meta.url))

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
// We cannot expand globbing patterns ourselves because it can hit the CLI
// max length.
export const jscpd = task(
  `jscpd --config=${JSCPD_CONFIG} --pattern=**/*.ts --pattern=**/*.js --ignore=**/*.test-d.ts src benchmark docs examples gulp`,
  { echo: false },
)
