'use strict'

const {
  constants: { errno },
} = require('os')

const execa = require('execa')
const PluginError = require('plugin-error')
const fancyLog = require('fancy-log')
const { cyan } = require('chalk')
const ms = require('ms')

// Execute a shell command
// To create a Gulp task, one should not use `bind()` as it removes
// `Function.name`. Instead one should do `const taskName = () => exec(...)`
// We avoid `exec.shell()` as it leads to shell-specific input which is not
// cross-platform.
// We avoid using a single string as input and tokenizing it as it's difficult
// with whitespaces escaping. Also escaping is shell-specific, e.g. on Windows
// `cmd.exe` only use double quotes not single quotes.
const createTask = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)

  const task = execCommand.bind(null, command, argsA, optsA)

  setDisplayName({ task, command })

  return task
}

const exec = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)
  return execCommand(command, argsA, optsA)
}

// eslint-disable-next-line fp/no-mutation
exec.task = createTask

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

const execCommand = async function(command, args, opts) {
  const commandStr = stringifyCommand({ command, args })

  printEcho({ commandStr, opts })

  try {
    return await execa(command, args, opts)
  } catch (error) {
    const message = getErrorMessage({ error, commandStr, opts })
    throw new PluginError('gulp-execa', message)
  }
}

const stringifyCommand = function({ command, args }) {
  return [command, ...args].join(' ')
}

const printEcho = function({ commandStr, opts: { echo = false } }) {
  if (!echo) {
    return
  }

  fancyLog(cyan.dim(commandStr))
}

// Retrieve error message to print
const getErrorMessage = function({
  error: { message, code, timedOut, signal },
  commandStr,
  opts,
}) {
  const description = getErrorDescription({ code, timedOut, signal, opts })
  const stack = getErrorStack({ message })
  const messageA = `Command '${commandStr}' ${description}${stack}`
  return messageA
}

const getErrorDescription = function({
  code,
  timedOut,
  signal,
  opts: { timeout },
}) {
  if (timedOut) {
    const timeoutStr = ms(timeout, { long: true })
    return `timed out after ${timeoutStr}`
  }

  if (signal !== null) {
    return `was killed with ${signal}`
  }

  const codeA = getExitCode({ code })
  return `failed with exit code ${codeA}`
}

const getErrorStack = function({ message }) {
  if (message.startsWith(DEFAULT_MESSAGE)) {
    return ''
  }

  return `: ${message}`
}

// `execa` adds a default error message that we don't want because it includes
// full stdout|stderr, which should already printed on console
const DEFAULT_MESSAGE = 'Command failed: '

// Retrieve exit code both as a number and as a string
const getExitCode = function({ code }) {
  // `execa` already tried to retrieve the exit code name
  if (Number.isInteger(code)) {
    return `${code}`
  }

  const codeNum = errno[code]

  if (codeNum === undefined) {
    return code
  }

  return `${codeNum} (${code})`
}

// We want to allow users to do `const task = execa(...)` instead of the
// more verbose `const task = () => execa(...)`. This is especially
// important when using `gulp.series()` or `gulp.parallel()`.
// However after binding a function or using a closure, assigning it to
// a variable does not change its `function.name` anymore. But this is
// used by Gulp as the displayed task name. So we use the command instead.
const setDisplayName = function({ task, command }) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  task.displayName = String(command)
}

module.exports = exec
