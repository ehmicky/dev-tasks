import { basename } from 'node:path'
import { cwd } from 'node:process'

import logProcessErrors from 'log-process-errors'

const loadLogProcessErrors = function () {
  if (isSelf()) {
    return
  }

  logProcessErrors({ testing: 'ava' })
}

// `log-process-errors` should not use itself
const isSelf = function () {
  const repoName = basename(cwd())
  return repoName === 'log-process-errors'
}

loadLogProcessErrors()
