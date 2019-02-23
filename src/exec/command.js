'use strict'

const execa = require('execa')
const fancyLog = require('fancy-log')
const { cyan } = require('chalk')

const { throwError, getErrorMessage } = require('./error')

// Fire the command with `execa()`
const execCommand = async function(command, args, opts) {
  const commandStr = stringifyCommand({ command, args })

  printEcho({ commandStr, opts })

  try {
    return await execa(command, args, opts)
  } catch (error) {
    const message = getErrorMessage({ error, commandStr, opts })
    throwError(message)
  }
}

const stringifyCommand = function({ command, args }) {
  return [command, ...args].join(' ')
}

// If `opts.echo` is `true` echo the command on the terminal
const printEcho = function({ commandStr, opts: { echo = false } }) {
  if (!echo) {
    return
  }

  fancyLog(cyan.dim(commandStr))
}

module.exports = {
  execCommand,
}
