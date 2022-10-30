import { basename } from 'node:path'
import { cwd } from 'node:process'

import logProcessErrors from 'log-process-errors'

const loadLogProcessErrors = function () {
  if (isSelf()) {
    return
  }

  logProcessErrors({
    onError(error) {
      throw error
    },
  })
}

// `log-process-errors` should not use itself
const isSelf = function () {
  return LOG_PROCESS_ERRORS_REPOS.has(basename(cwd()))
}

const LOG_PROCESS_ERRORS_REPOS = new Set([
  'log-process-errors',
  'modern-errors-process',
  'modern-errors',
])

loadLogProcessErrors()
