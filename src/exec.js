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
const createTask = function(command, args, opts) {
  const [argsA, optsA] = parseArgs(args, opts)

  const task = exec.bind(null, command, argsA, optsA)

  setDisplayName({ task, command })

  return task
}

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

const exec = async function(command, args, opts) {
  try {
    return await execa(command, args, opts)
  } catch (error) {
    const message = getErrorMessage({ error, command, args })
    throw new PluginError('gulp-execa', message)
  }
}

// eslint-disable-next-line fp/no-mutation
exec.task = createTask

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
