// Ava requires configuration file to be a the repository's top-level
import { fileURLToPath } from 'node:url'

const MAIN_SOURCE = 'src'
const BUILT_MAIN_SOURCE = 'build/src'
const SNAPSHOT_DIR = `${MAIN_SOURCE}/snapshots/`
const TEST_FILES = `${BUILT_MAIN_SOURCE}/**/*.test.js`
const NON_TEST_FILES = `${BUILT_MAIN_SOURCE}/{helpers,fixtures}/**`

const LOG_PROCESS_ERRORS = fileURLToPath(
  new URL(
    `${BUILT_MAIN_SOURCE}/tasks/unit/log_process_errors.js`,
    import.meta.url,
  ),
)

export default {
  // Worker threads make it harder to test `cwd` options since `process.chdir()`
  // is not available
  workerThreads: false,
  files: [TEST_FILES, `!${NON_TEST_FILES}`],
  snapshotDir: SNAPSHOT_DIR,
  // Otherwise, if build watch is run as well, modifying source files trigger
  // tests twice
  watchMode: {
    ignoreChanges: [MAIN_SOURCE],
  },
  // Use `log-process-errors`
  require: LOG_PROCESS_ERRORS,
  timeout: `3600s`,
  // Ensure reproducible tests.
  // For example, `--enable-source-maps` results in different `error.stack`
  // per environment.
  environmentVariables: { NODE_OPTIONS: '' },
}
