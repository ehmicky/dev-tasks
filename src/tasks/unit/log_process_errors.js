import { cwd } from 'process'
import { basename } from 'path'

import logProcessErrors from 'log-process-errors'

// `log-process-errors` should not use itself
const isSelf = function() {
  return basename(cwd()) === 'log-process-errors'
}

// TODO: remove once https://github.com/sinonjs/lolex/issues/232 is solved
const warning = function({ message }) {
  if (message.includes('queueMicrotask() is experimental')) {
    return 'silent'
  }
}

if (!isSelf()) {
  logProcessErrors({ testing: 'ava', level: { warning } })
}
