'use strict'

// Parse main arguments and options
const parseOpts = function(opts) {
  const optsA = { ...DEFAULT_OPTS, ...opts }
  const optsB = addStdio({ opts: optsA })
  // `shell` option encourages shell-specific syntax like globbing or
  // variables expansion
  const optsC = { ...optsB, shell: false }
  return optsC
}

const DEFAULT_OPTS = { echo: false }

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
  parseOpts,
}
