'use strict'

const execa = require('execa')
const PluginError = require('plugin-error')

// Execute a shell command
// To create a Gulp task, one should not use `bind()` as it removes
// `Function.name`. Instead one should do `const taskName = () => exec(...)`
// We avoid `exec.shell()` as it leads to shell-specific input which is not
// cross-platform.
// We avoid using a single string as input and tokenizing it as it's difficult
// with whitespaces escaping. Also escaping is shell-specific, e.g. on Windows
// `cmd.exe` only use double quotes not single quotes.
const exec = async function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)

  const optsB = addStdio({ opts: optsA })

  try {
    const result = await execa(command, argsA, optsB)
    return result
  } catch (error) {
    const message = getErrorMessage({ error, command, args: argsA })
    throw new PluginError('gulp-execa', message)
  }
}

const parseArgs = function(args, opts) {
  const [argsA = [], optsA = {}] = parseOptionalArgs(args, opts)
  return [argsA, optsA]
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

// Retrieve error message to print
const getErrorMessage = function({
  error: { message, code, timedOut, signal },
  command,
  args,
}) {
  const commandA = [command, ...args].join(' ')
  const description = getErrorDescription({ code, timedOut, signal })
  const trace = getErrorTrace({ message })
  const messageB = `Command '${commandA}' ${description} ${trace}`
  return messageB
}

const getErrorDescription = function({ code, timedOut, signal }) {
  if (timedOut) {
    return 'timed out'
  }

  if (signal !== null) {
    return `was killed with ${signal}`
  }

  return `failed with exit code ${code}`
}

const getErrorTrace = function({ message }) {
  if (message.startsWith(DEFAULT_MESSAGE)) {
    return ''
  }

  return `: ${message}`
}

// `execa` adds a default error message that we don't want because it includes
// full stdout|stderr, which should already printed on console
const DEFAULT_MESSAGE = 'Command failed: '

module.exports = exec
