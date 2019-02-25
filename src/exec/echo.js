'use strict'

const fancyLog = require('fancy-log')
const { cyan } = require('chalk')

// If `opts.echo` is `true` echo the command on the terminal
const printEcho = function({ input, opts: { echo = false } }) {
  if (!echo) {
    return
  }

  fancyLog(cyan.dim(input))
}

module.exports = {
  printEcho,
}
