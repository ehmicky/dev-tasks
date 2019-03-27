'use strict'

const { cwd } = require('process')
const { basename } = require('path')

const logProcessErrors = require('log-process-errors')

// `log-process-errors` should not use itself
const isSelf = function() {
  return basename(cwd()) === 'log-process-errors'
}

if (!isSelf()) {
  logProcessErrors({ testing: 'ava' })
}
