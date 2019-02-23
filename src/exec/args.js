'use strict'

// Parse main arguments and options
const parseArgs = function(args, opts) {
  const [argsA = [], optsA = {}] = parseOptionalArgs(args, opts)
  const optsB = addStdio({ opts: optsA })
  return [argsA, optsB]
}

const parseOptionalArgs = function(args, opts) {
  if (typeof args === 'object' && !Array.isArray(args)) {
    return [undefined, args]
  }

  return [args, opts]
}

// Default to piping shell stdin|stdout|stderr to console.
const addStdio = function({ opts }) {
  // Unless user specified another stdio redirection.
  if (opts.stdio !== undefined) {
    return opts
  }

  if (opts.input !== undefined) {
    return { stdout: 'inherit', stderr: 'inherit', ...opts }
  }

  return { stdin: 'inherit', stdout: 'inherit', stderr: 'inherit', ...opts }
}

module.exports = {
  parseArgs,
}
