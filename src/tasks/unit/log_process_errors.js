'use strict'

const { cwd } = require('process')
const { basename } = require('path')

const logProcessErrors = require('log-process-errors')

// `log-process-errors` should not use itself
const isSelf = function() {
  return basename(cwd()) === 'log-process-errors'
}

// TODO: remove once https://github.com/sinonjs/lolex/issues/232 is solved
const warning = function({ value }) {
  if (
    value instanceof Error &&
    value.message.includes('queueMicrotask() is experimental')
  ) {
    return 'silent'
  }
}

if (!isSelf()) {
  logProcessErrors({ testing: 'ava', level: { warning } })
}
