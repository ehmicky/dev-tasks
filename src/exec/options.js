'use strict'

// Parse main arguments and options
const parseOpts = function(opts = {}) {
  const optsA = addStdio({ opts })
  // `shell` option encourages shell-specific syntax like globbing or
  // variables expansion
  const optsB = { ...optsA, shell: false }
  return optsB
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
  parseOpts,
}
