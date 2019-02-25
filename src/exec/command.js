'use strict'

const execa = require('execa')
const fancyLog = require('fancy-log')
const { cyan } = require('chalk')

const { splitInput } = require('./split')
const { getError, getErrorMessage } = require('./error')

// Fire the command with `execa()`
const execCommand = async function(input, opts) {
  printEcho({ input, opts })

  const { command, args } = splitInput({ input })

  try {
    return await execa(command, args, opts)
  } catch (error) {
    const message = getErrorMessage({ error, input, opts })
    throw getError(message)
  }
}

// If `opts.echo` is `true` echo the command on the terminal
const printEcho = function({ input, opts: { echo = false } }) {
  if (!echo) {
    return
  }

  fancyLog(cyan.dim(input))
}

module.exports = {
  execCommand,
}
